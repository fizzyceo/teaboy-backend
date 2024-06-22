import { Module } from '@nestjs/common';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';

@Module({
  controllers: [MenuItemController],
  providers: [MenuItemService]
})
export class MenuItemModule {}
