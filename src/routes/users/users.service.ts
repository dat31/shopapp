import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { cloneDeep, omit } from 'lodash';
import { EmployeeSchedulesService } from 'routes/employee-schedules/employee-schedules.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private scheduleService: EmployeeSchedulesService,
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
    return this.userRepo.findOne({
      where: { id },
      relations: { employees: true },
    });
  }

  findByUsername(username: string) {
    return this.userRepo.findOne({
      where: { username },
      select: { password: true },
    });
  }

  findSchedules(employeeId: User['id']) {
    return this.scheduleService.findAllByEmployeeId(employeeId);
  }

  findEmployeeSchedules() {}

  findEmployees(id: User['id']) {
    return this.userRepo.findAndCount({
      where: { owner: { id } },
      select: { password: false },
    });
  }

  findEmployeeDetail(id: User['id'], ownerId: User['id']) {
    return this.userRepo.findOne({
      where: { id, owner: { id: ownerId } },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = cloneDeep(updateUserDto);
    if (updateUserDto.owner) {
      const owner = await this.findOne(updateUserDto.owner.id);
      if (!owner) {
        throw new NotFoundException();
      }
      user.owner = owner;
    }
    return this.userRepo.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
