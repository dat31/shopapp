import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeSchedulesService } from 'routes/employee-schedules/employee-schedules.service';
import { assign } from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private scheduleService: EmployeeSchedulesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto);
  }

  async createEmployee(createUserDto: CreateUserDto, ownerId: string) {
    const owner = this.userRepo.findOne({ where: { uid: ownerId } });
    const employee = assign(new User(), {
      ...createUserDto,
      owner,
    });

    return this.userRepo.save(employee);
  }

  findOne(uid: string) {
    return this.userRepo.findOne({
      where: { uid },
      relations: { employees: true },
    });
  }

  findSchedules(employeeId: User['uid']) {
    return this.scheduleService.findAllByEmployeeId(employeeId);
  }

  findEmployeeSchedules() {}

  findEmployees(uid: User['uid']) {
    return this.userRepo.find({
      where: { owner: { uid }, uid: Not(uid) },
    });
  }

  findEmployeeDetail(uid: User['uid'], ownerId: User['uid']) {
    return this.userRepo.findOne({
      where: { uid, owner: { uid: ownerId } },
    });
  }

  async updateEmployee(
    uid: string,
    updateUserDto: UpdateUserDto,
    ownerId: User['uid'],
  ) {
    const owner = await this.findOne(ownerId);
    if (!owner) {
      throw new NotFoundException();
    }
    return this.userRepo.save(updateUserDto);
  }

  update(updateUserDto: UpdateUserDto) {
    return this.userRepo.save(updateUserDto);
  }

  removeEmployee(uid: string, ownerId: string) {
    return this.userRepo.delete({
      uid,
      owner: { uid: ownerId },
    });
  }
}
