import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CALL_STATUS } from "./dto/create-call.dto";
import { DatabaseService } from "src/database/database.service";
import { KitchenService } from "../kitchen/kitchen.service";

@Injectable()
export class CallService {
  constructor(
    private readonly database: DatabaseService,
    private readonly kitchenService: KitchenService
  ) {}

  async startCall(space_id: number, user_id: number) {
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

    const kitchen = await this.database.kitchen.findFirst({
      where: {
        spaces: {
          some: {
            space_id: space_id,
          },
        },
      },
      select: {
        kitchen_id: true,
      },
    });

    if (!kitchen) {
      throw new NotFoundException(
        `No kitchen found for space with id ${space_id}`
      );
    }

    const isKitchenOpen = await this.kitchenService.isKitchenCurrentlyOpen(
      kitchen.kitchen_id
    );

    if (!isKitchenOpen) {
      throw new ConflictException(
        "Cannot start call, kitchen is currently closed."
      );
    }

    const call = await this.database.call.create({
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

    setTimeout(async () => {
      const existingCall = await this.database.call.findUnique({
        where: {
          call_id: call.call_id,
        },
        select: { status: true },
      });

      if (existingCall && existingCall.status === "STARTED") {
        await this.database.call.update({
          where: {
            call_id: call.call_id,
          },
          data: { status: "FAILED" },
        });
      }
    }, 50000);

    return call;
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
      select: {
        space_id: true,
        call_id: true,
        status: true,
        updated_at: true,
        created_at: true,
        User: {
          select: {
            user_id: true,
            name: true,
            spaces: {
              select: {
                space_id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return calls.map((call) => ({
      call_id: call.call_id,
      status: call.status,
      updated_at: call.updated_at,
      created_at: call.created_at,
      User: {
        user_id: call.User.user_id,
        name: call.User.name,
        space: {
          ...call.User.spaces.find((space) => space.space_id === call.space_id),
        },
      },
    }));
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
      select: {
        call_id: true,
        status: true,
        space_id: true,
        updated_at: true,
        created_at: true,
        User: {
          select: {
            user_id: true,
            name: true,
            spaces: {
              select: {
                space_id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }

    return {
      call_id: call.call_id,
      status: call.status,
      updated_at: call.updated_at,
      created_at: call.created_at,
      User: {
        user_id: call.User.user_id,
        name: call.User.name,
        space: {
          ...call.User.spaces.find((space) => space.space_id === call.space_id),
        },
      },
    };
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
      select: {
        call_id: true,
        status: true,
        updated_at: true,
        created_at: true,
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
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
      select: {
        call_id: true,
        status: true,
        updated_at: true,
        created_at: true,
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
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
