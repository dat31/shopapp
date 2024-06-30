import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
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

  async createEmployee(createUserDto: CreateUserDto, ownerId: number) {
    console.log('ownerId', ownerId);
    const user = { ...new User(), ...createUserDto, owner: { id: ownerId } };
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
      select: { password: false },
    });
  }

  findByUsername(username: string) {
    return this.userRepo.findOne({
      where: { username },
      select: ['username', 'password', 'id'],
    });
  }

  findSchedules(employeeId: User['id']) {
    return this.scheduleService.findAllByEmployeeId(employeeId);
  }

  findEmployeeSchedules() {}

  findEmployees(id: User['id']) {
    return this.userRepo.find({
      where: { owner: { id } },
    });
  }

  findEmployeeDetail(id: User['id'], ownerId: User['id']) {
    return this.userRepo.findOne({
      where: { id, owner: { id: ownerId } },
    });
  }

  async updateEmployee(
    id: number,
    updateUserDto: UpdateUserDto,
    ownerId: User['id'],
  ) {
    const owner = await this.findOne(ownerId);
    if (!owner) {
      throw new NotFoundException();
    }
    return this.userRepo.save(updateUserDto);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.save({
      id,
      ...updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  removeEmployee(id: number, ownerId: number) {
    return this.userRepo.delete({
      id,
      owner: { id: ownerId },
    });
  }
}
