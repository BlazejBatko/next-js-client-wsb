import { Module } from '@nestjs/common';
import { ResidentionService } from './residention.service';
import { ResidentionController } from './residention.controller';

@Module({
  providers: [ResidentionService],
  controllers: [ResidentionController],
})
export class ResidentionModule {}
