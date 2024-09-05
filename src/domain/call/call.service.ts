import { Injectable, NotFoundException } from "@nestjs/common";
import { CALL_STATUS, CreateCallDto } from "./dto/create-call.dto";
import { UpdateCallDto } from "./dto/update-call.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class CallService {
  constructor(private readonly database: DatabaseService) {}

  async startCall(space_id: number, user_id: number) {
    // const { space_id, status } = createCallDto;

    console.log("space_id", space_id);

    const space = await this.database.space.findFirst({
      where: {
        AND: [
          { space_id: space_id },
          {
            users: {
              some: {
                user_id: user_id,
              },
            },
          },
        ],
      },
    });

    if (!space) {
      throw new NotFoundException(`Space with id ${space_id} not found`);
    }

    return await this.database.call.create({
      data: {
        status: "STARTED",
        Space: {
          connect: {
            space_id: space_id,
          },
        },
        User: {
          connect: {
            user_id: user_id,
          },
        },
      },
    });
  }

  async getKitchenCalls(kitchen_id: number) {
    const kitchen = await this.database.kitchen.findFirst({
      where: {
        kitchen_id: kitchen_id,
      },
    });

    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${kitchen_id} not found`);
    }

    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const createdAtCondition = { created_at: { gte: last24Hours } };

    const calls = await this.database.call.findMany({
      where: {
        AND: [
          {
            Space: {
              kitchen_id: kitchen_id,
            },
          },
          createdAtCondition,
        ],
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return calls;
  }

  async getCallStatus(id: number, user_id: number) {
    const call = await this.database.call.findFirst({
      where: {
        AND: [
          { call_id: id },
          {
            User: {
              user_id: user_id,
            },
          },
        ],
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }

    return call;
  }

  async getCallDetails(id: number, kitchen_id: number) {
    const call = await this.database.call.findFirst({
      where: {
        AND: [
          { call_id: id },
          {
            Space: {
              kitchen_id: kitchen_id,
            },
          },
        ],
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }

    return call;
  }

  async updateCallUser(id: number, status: CALL_STATUS, user_id: number) {
    const call = await this.database.call.findFirst({
      where: {
        AND: [
          { call_id: id },
          {
            User: {
              user_id: user_id,
            },
          },
        ],
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }

    return await this.database.call.update({
      where: {
        call_id: id,
      },
      data: {
        status,
      },
    });
  }

  async updateCallKitchen(id: number, status: CALL_STATUS, kitchen_id: number) {
    const call = await this.database.call.findFirst({
      where: {
        AND: [
          { call_id: id },
          {
            Space: {
              kitchen_id: kitchen_id,
            },
          },
        ],
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }

    return await this.database.call.update({
      where: {
        call_id: id,
      },
      data: {
        status,
      },
    });
  }

  async deleteCall(id: number, user_id: number) {
    const call = await this.database.call.findFirst({
      where: {
        AND: [
          { call_id: id },
          {
            User: {
              user_id: user_id,
            },
          },
        ],
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }

    return await this.database.call.delete({
      where: {
        call_id: id,
      },
    });
  }
}
