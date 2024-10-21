import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class KitchenJwtStrategy extends PassportStrategy(
  Strategy,
  "kitchen-jwt"
) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { kitchen_id: number }) {
    const kitchen = await this.databaseService.kitchen.findUnique({
      where: { kitchen_id: payload?.kitchen_id },
    });

    if (!kitchen) {
      throw new UnauthorizedException("Invalid kitchen ID");
    }

    return { kitchen_id: kitchen.kitchen_id };
  }
}
