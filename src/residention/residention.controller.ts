import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { ResidentionService } from './residention.service';
import { CreateResidentionDto } from 'src/auth/dto';

@UseGuards(JwtGuard)
@Controller('residention')
export class ResidentionController {
  constructor(private residenceService: ResidentionService) {}

  @Get()
  async getResidencies(@GetUser() user: User) {
    return this.residenceService.getResidenciesByUserId(user.id);
  }

  @Get(':id')
  getResidention(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) residentionId: number,
  ) {
    return this.residenceService.getUserResidentionById(user.id, residentionId);
  }

  @Post()
  createResidention(
    @GetUser() user: User,
    @Body() payload: CreateResidentionDto,
  ) {
    return this.residenceService.createResidention(user.id, payload);
  }

  @Put(':id')
  updateResidention(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) residentionId: number,
    @Body() payload: CreateResidentionDto,
  ) {
    return this.residenceService.updateResidention(
      user.id,
      residentionId,
      payload,
    );
  }

  @Delete(':id')
  deleteResidention(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) residentionId: number,
  ) {
    return this.residenceService.deleteResidention(user.id, residentionId);
  }
}
