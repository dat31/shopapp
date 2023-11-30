import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = { ...new User(), ...createUserDto };
    user.password = await bcrypt.hash(createUserDto.password, 10);
    return omit(this.userRepo.save(user), 'password');
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  findByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
