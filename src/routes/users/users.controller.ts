import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  FirebaseAuth,
  GetFirebaseUser,
} from 'firebase-admin/firebase-auth.decorator';
import { GetFirebaseUserInterceptor } from 'firebase-admin/get-firebase-user.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id/schedules')
  findSchedules(@Param('id') id: string) {
    return this.usersService.findSchedules(id);
  }

  @GetFirebaseUser(GetFirebaseUserInterceptor.ARRAY)
  @UseInterceptors(GetFirebaseUserInterceptor)
  @FirebaseAuth()
  @Get('/employees')
  findEmployees(@Request() req) {
    return this.usersService.findEmployees(req.user.uid);
  }

  @FirebaseAuth()
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('/employees')
  createEmployees(@Request() req, @Body() dto: CreateUserDto) {
    return this.usersService.createEmployee(dto, req.user.id);
  }

  @Delete('/employees/:id')
  deleteEmployee(@Request() req, @Param('id') id: string) {
    return this.usersService.removeEmployee(id, req.user.id);
  }

  @GetFirebaseUser(GetFirebaseUserInterceptor.OBJECT)
  @UseInterceptors(GetFirebaseUserInterceptor)
  @FirebaseAuth()
  @Get('/employees/:uid')
  findEmployeeDetail(@Request() req, @Param('uid') uid: string) {
    return this.usersService.findEmployeeDetail(uid, req.user.uid);
  }

  @FirebaseAuth()
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(id, updateUserDto, req.user.id);
  }
}
