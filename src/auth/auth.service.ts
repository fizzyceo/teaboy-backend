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
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const employee = await this.databaseService.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      throw new NotFoundException("employee not found");
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    return {
      accessToken: this.jwtService.sign({
        employee_id: employee.employee_id,
        email: employee.email,
      }),
    };
  }
}
