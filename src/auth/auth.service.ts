import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { UsersService } from 'routes/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private confService: ConfigService,
  ) {}

  async login({ username, password }: LoginDto) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return {
      token: await this.jwtService.signAsync(omit(user, 'password'), {
        secret: this.confService.get('JWT_SECRET'),
      }),
    };
  }
}
