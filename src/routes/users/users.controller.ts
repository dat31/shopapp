import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/schedules')
  findSchedules(@Param('id') id: string) {
    return this.usersService.findSchedules(+id);
  }

  @Get('/employees')
  findEmployees(@Request() req) {
    console.log(req.user.id);
    return this.usersService.findEmployees(req.user.id);
  }

  // @Auth()
  @Post('/employees')
  createEmployees(@Request() req, @Body() dto: CreateUserDto) {
    console.log('kk', req.user);
    return this.usersService.createEmployee(dto, req.user.id);
  }

  // @Auth()
  @Delete('/employees/:id')
  deleteEmployee(@Request() req, @Param('id') id: string) {
    return this.usersService.removeEmployee(+id, req.user.id);
  }

  // @Auth()
  @Get('/employees/:id')
  findEmployeeDetail(@Request() req, @Param('id') id: string) {
    return this.usersService.findEmployeeDetail(+id, req.user.id);
  }

  //TODO: delete in prod
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Auth()
  @Patch('/employees/:id')
  updateEmployee(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.updateEmployee(+id, updateUserDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
