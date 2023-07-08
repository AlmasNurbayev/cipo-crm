import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SubscribeController],
  providers: [SubscribeService]
})
export class SubscribeModule {}
