import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: AuthDto, @Response({ passthrough: true }) res) {
    const { access_token, user } = await this.authService.login(dto);
    res.cookie('access_token', access_token);

    return {
      access_token,
      ...user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(
    @Response({ passthrough: true }) response,
    @Body() dto: AuthDto,
  ) {
    const res = await this.authService.signup(dto);

    // set the cookie
    response.cookie('access_token', res.access_token);

    return {
      ...res,
    };
  }

  @Post('logout')
  async logout(@Response({ passthrough: true }) response) {
    response.clearCookie('access_token');

    return {
      message: 'success',
    };
  }
}
