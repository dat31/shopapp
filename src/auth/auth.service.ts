import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'routes/users/users.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'routes/users/entities/user.entity';
import { omit } from 'lodash';

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
      token: this.jwtService.sign(
        { user: omit(user, 'password') },
        {
          secret: this.confService.get('JWT_SECRET'),
        },
      ),
    };
  }

  register(dto: RegisterDto) {
    return this.userService.create(dto);
  }

  getProfile(id: User['id']) {
    return this.userService.findOne(id);
  }
}
