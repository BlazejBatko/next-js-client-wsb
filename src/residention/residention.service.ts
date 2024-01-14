import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResidentionDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResidentionService {
  constructor(private prismaService: PrismaService) {}

  async getResidenciesByUserId(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        residentions: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.residentions;
  }

  async getUserResidentionById(userId: number, residentionId) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        residentions: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const residention = user.residentions.find(
      (residention) => residention.id === residentionId,
    );

    if (!residention) {
      throw new NotFoundException('Residention not found');
    }

    return residention;
  }

  async createResidention(
    userId: number,
    residentionPayload: CreateResidentionDto,
  ) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prismaService.residention.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        ...residentionPayload,
      },
    });
  }

  async updateResidention(
    userId: number,
    residentionId: number,
    payload: CreateResidentionDto,
  ) {
    const residention = await this.getUserResidentionById(
      userId,
      residentionId,
    );

    if (!residention) {
      throw new NotFoundException('Residention not found');
    }

    return this.prismaService.residention.update({
      where: {
        id: residention.id,
      },
      data: {
        ...payload,
      },
    });
  }

  async deleteResidention(userId: number, residentionId: number) {
    const residention = await this.getUserResidentionById(
      userId,
      residentionId,
    );

    if (!residention) {
      throw new NotFoundException('Residention not found');
    }

    await this.prismaService.residention.delete({
      where: {
        id: residention.id,
      },
    });

    return {
      message: 'Residention deleted',
    };
  }
}
