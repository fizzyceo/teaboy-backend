import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "src/database/database.service";
import { AuthEntity } from "./entity/auth.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserAuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
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
}
