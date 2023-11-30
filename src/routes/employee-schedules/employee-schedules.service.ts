import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeScheduleDto } from './dto/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/update-employee-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeSchedule } from './entities/employee-schedule.entity';
import { Repository } from 'typeorm';
import { pick } from 'lodash';
import { User } from 'routes/users/entities/user.entity';

@Injectable()
export class EmployeeSchedulesService {
  constructor(
    @InjectRepository(EmployeeSchedule)
    private repo: Repository<EmployeeSchedule>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create({
    shiftEndTime,
    shiftStartTime,
    ...createEmployeeScheduleDto
  }: CreateEmployeeScheduleDto) {
    if (!createEmployeeScheduleDto.employee?.id) {
      throw new NotFoundException();
    }
    const employee = await this.userRepo.findOne({
      where: {
        id: createEmployeeScheduleDto.employee.id,
      },
    });
    if (!employee) {
      throw new NotFoundException();
    }
    const schedule = {
      ...new EmployeeSchedule(),
      ...createEmployeeScheduleDto,
      shiftStartTime: shiftStartTime ? new Date(shiftStartTime) : new Date(),
      ...(shiftEndTime ? { shiftEndTime: new Date(shiftEndTime) } : {}),
    } as EmployeeSchedule;
    schedule.employee = employee;
    return this.repo.save(schedule);
  }

  findAll() {
    return `This action returns all employeeSchedules`;
  }

  findAllByEmployeeId(employeeId: User['id']) {
    return this.repo.find({ where: { employee: { id: employeeId } } });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateEmployeeScheduleDto: UpdateEmployeeScheduleDto) {
    return this.repo.update(
      id,
      pick(updateEmployeeScheduleDto, ['shiftEndTime', 'shiftStartTime']),
    );
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
