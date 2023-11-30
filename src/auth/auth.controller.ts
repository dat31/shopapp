import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    req.session.a = 'a';
    return this.authService.login(loginDto);
  }

  @Auth()
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.session);

    return req.user;
  }
}
