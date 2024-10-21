import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class UserSpaceLinkService {
  constructor(private readonly database: DatabaseService) {}

  async getAllLinks(spaceIds: Array<number>) {
    return await this.database.spaceUserLink.findMany({
      where: {
        space_id: {
          in: spaceIds,
        },
      },
      include: {
        space: true, // Include all information related to the space
      },
    });
  }

  async GetUserSpaces(user_email: string) {
    return await this.database.spaceUserLink.findMany({
      where: {
        user_email: user_email,
      },
      include: {
        space: true, // Include all information related to the space
      },
    });
  }

  async GetSpaceUsers(space_id: number) {
    return await this.database.spaceUserLink.findMany({
      where: {
        space_id: space_id,
      },
      select: {
        space_id: true,
        user_email: true,
      },
    });
  }

  async LinkSpaceUser(space_id: number, user_email: string) {
    //we get the email of the user, see if it exists on the user table + if signedUp = true
    //if it doesnt we create a new user table with the password and the other info empty, just the email
    //we get the id of the created user, or the existing user and create a new link between it and the space + the id of the company this space belongs to

    // const email = ""
    const userFound = await this.database.user.findUnique({
      where: { email: user_email, signedUp: true },
    });

    console.log("userFound: ", userFound);

    if (!userFound) {
      const link = await this.database.spaceUserLink.findFirst({
        where: { user_email: user_email, space_id: space_id },
      });

      if (link) {
        throw new NotFoundException(`Link already exists`);
      }

      console.log("not found ");
      await this.database.user.create({
        data: {
          email: user_email,
          signedUp: false,
        },
      });
    }
    const space = await this.database.space.findUnique({
      where: { space_id: space_id },
    });

    if (!space) {
      throw new NotFoundException(`Space with id ${space_id} not found`);
    }

    return await this.database.spaceUserLink.create({
      data: {
        space_id: space_id,
        user_email: user_email,
      },
    });
  }

  async UnlinkSpaceUser(link_id: number) {
    return await this.database.spaceUserLink.delete({
      where: {
        link_id: link_id,
      },
    });
  }
}
