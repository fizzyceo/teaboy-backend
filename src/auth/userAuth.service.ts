import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "src/database/database.service";
import { AuthEntity } from "./entity/auth.entity";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { MailerService } from "@nestjs-modules/mailer";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgotPassword.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dt";

@Injectable()
export class UserAuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        "Email not verified. Please check your email for the verification link."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    return {
      accessToken: this.jwtService.sign({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      await this.databaseService.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          role: registerDto.role,
          phone: registerDto.phone,
          password: hashedPassword,
          verificationToken: verificationToken,
          verificationExpires: verificationExpires,
        },
      });

      await this.mailerService.sendMail({
        to: registerDto.email,
        subject: "Email Verification",
        html: `Hello ${registerDto.name},<br><br>
         Thank you for registering. Please click the link below to verify your email address:<br>
         <a href="${process.env.FRONTEND_URL}/auth/validate-email/${verificationToken}">Verify Email</a><br><br>
         If you did not register, please ignore this email.`,
      });

      return {
        message: "Signup successful, please check your email for verification",
        token: verificationToken,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async verifyEmail(token: string) {
    const user = await this.databaseService.user.findUnique({
      where: { verificationToken: token.trim() },
    });

    if (!user) {
      throw new BadRequestException("Invalid token or user not found");
    }

    if (user.verificationExpires < new Date()) {
      throw new BadRequestException("Token has expired");
    }

    await this.databaseService.user.update({
      where: { user_id: user.user_id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    return {
      message: "Email verified successfully",
      error: false,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const otp = crypto.randomBytes(3).toString("hex").toUpperCase();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this.databaseService.user.update({
      where: { user_id: user.user_id },
      data: {
        resetPasswordToken: otp,
        resetPasswordExpires: otpExpires,
      },
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Hello ${user.name},\n\nYour OTP for resetting your password is: ${otp}.\nIt will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.`,
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isVerified === false) {
      throw new BadRequestException("Email not verified");
    }

    if (user.resetPasswordToken !== dto.otp) {
      throw new BadRequestException("Invalid OTP");
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException("OTP has expired");
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.databaseService.user.update({
      where: { user_id: user.user_id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}
