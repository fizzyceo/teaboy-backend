import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "src/database/database.service";
import { AuthEntity } from "./entity/auth.entity";

@Injectable()
export class KitchenAuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async login(token: string, fcmToken: string): Promise<AuthEntity> {
    const kitchen = await this.databaseService.kitchen.findUnique({
      where: { token },
    });

    if (!kitchen) {
      throw new NotFoundException("Kitchen not found");
    }

    const accessToken = this.jwtService.sign(
      {
        kitchen_id: kitchen.kitchen_id,
      },
      {
        expiresIn: "1y",
      }
    );

    // await this.databaseService.kitchenTablet.create({
    //   data: {
    //     fcmToken: fcmToken,
    //     kitchen: {
    //       connect: {
    //         kitchen_id: kitchen.kitchen_id,
    //       },
    //     },
    //   },
    // });

    return {
      accessToken,
    };
  }
}
