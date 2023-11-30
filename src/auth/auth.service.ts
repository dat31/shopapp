import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { UsersService } from 'routes/users/users.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'routes/users/entities/user.entity';

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
    console.log(password, user.password);
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

  register(dto: RegisterDto) {
    return this.userService.create(dto);
  }

  getProfile(id: User['id']) {
    return this.userService.findOne(id);
  }
}
