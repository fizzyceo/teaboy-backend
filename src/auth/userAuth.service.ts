import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "src/database/database.service";
import { AuthEntity, AuthEntity2 } from "./entity/auth.entity";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { MailerService } from "@nestjs-modules/mailer";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgotPassword.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dt";
import { UserService } from "src/domain/user/user.service";
import { template1 } from "src/email-template/template-1";

@Injectable()
export class UserAuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}
  private async checkIfUserExists(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email, signedUp: true },
    });
    if (user) {
      throw new ConflictException("Email already exists");
    }
  }
  private async checkIfUserIsInvited(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email, signedUp: false },
    });
    if (user) {
      return user.user_id;
    } else {
      return null;
    }
  }

  async login(email: string, pass: string): Promise<AuthEntity2> {
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

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }
    const {
      password,
      role,
      isDeleted,
      isVerified,
      verificationExpires,
      verificationToken,
      resetPasswordExpires,
      resetPasswordToken,
      ...rest
    } = user;
    return {
      accessToken: this.jwtService.sign({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      }),
      user: rest, // You should return the user data minus the password
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Check if the user already exists
    await this.checkIfUserExists(registerDto.email);

    // Check if the user was invited
    const isInvited = await this.checkIfUserIsInvited(registerDto.email);

    if (isInvited) {
      await this.databaseService.user.update({
        where: { user_id: isInvited },
        data: {
          name: registerDto.name,
          phone: registerDto.phone,
          password: hashedPassword,
          verificationToken: verificationToken,
          verificationExpires: verificationExpires,
          signedUp: true,
        },
      });
    } else {
      await this.databaseService.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          role: registerDto.role,
          phone: registerDto.phone,
          password: hashedPassword,
          verificationToken: verificationToken,
          verificationExpires: verificationExpires,
          signedUp: true,
        },
      });
    }

    // Attempt to send verification email
    try {
      await this.mailerService.sendMail({
        to: registerDto.email,
        subject: "Email Verification",
        html: template1(
          registerDto.name,
          process.env.FRONTEND_URL,
          verificationToken
        ),
      });
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);

      throw new BadRequestException(
        `Error sending verification email: ${emailError}`
      );
      // You could return a specific message here, but don’t fail the registration
    }

    // Return success response, even if the email fails
    return {
      message:
        "Signup successful. If email verification fails, please contact support.",
      token: verificationToken,
    };
  }

  async generateNewOtp(newOtpDto: ForgotPasswordDto) {
    const { email } = newOtpDto;

    // Step 1: Check if the user exists
    const user = await this.databaseService.user.findUnique({
      where: { email, isVerified: false },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    // Step 2: Enforce a rate limit to prevent spamming OTP requests (e.g., 1 OTP per 10 minutes)
    const lastOtpTime = user.updated_at;
    const currentTime = new Date();

    if (
      lastOtpTime &&
      currentTime.getTime() - lastOtpTime.getTime() < 1 * 60 * 1000
    ) {
      throw new BadRequestException(
        "You can only request a new OTP every 1 minute."
      );
    }

    // Step 3: Generate a new OTP token and expiration date (e.g., 24 hours)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Step 4: Update the user record with the new OTP and expiration
    await this.databaseService.user.update({
      where: { email },
      data: {
        verificationToken,
        verificationExpires,
      },
    });

    // Step 5: Attempt to send the new OTP via email
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Password Reset OTP",
        html: template1(user.name, process.env.FRONTEND_URL, verificationToken),
      });
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      throw new BadRequestException(`Error sending OTP email: ${emailError}`);
    }

    return {
      message:
        "A new OTP has been sent to your email. Please check your inbox.",
    };
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
