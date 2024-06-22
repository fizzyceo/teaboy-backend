import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';

@Module({
  controllers: [DatabaseController]
})
export class DatabaseModule {}
