import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: AuthDto) {
    // find the user in the db
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    // if user doesn't exist, throw an exception
    if (!user) {
      throw new ForbiddenException('Wrong email or password');
    }

    // compare password
    // if password doesn't match, throw an exception
    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Wrong email or password');
    }

    delete user.hash;

    return user;
  }

  async signup(dto: AuthDto) {
    // generate the password hash

    try {
      const hash = await argon.hash(dto.password);
      // save the new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // remove the password hash from the user object
      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }
}
