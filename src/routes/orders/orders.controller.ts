import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderItemDto } from 'routes/orderitems/dto/create-orderitem.dto';
import {
  FirebaseAuth,
  GetFirebaseUser,
} from 'firebase-admin/firebase-auth.decorator';
import { GetFirebaseUserInterceptor } from '../../firebase-admin/get-firebase-user.interceptor';
import { Order } from './entities/order.entity';
import { FilterOrderDto } from './dto/filter-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @FirebaseAuth()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(req.user?.uid, createOrderDto);
  }

  @GetFirebaseUser(GetFirebaseUserInterceptor.ARRAY, 'creator')
  @UseInterceptors(GetFirebaseUserInterceptor<Order[]>)
  @FirebaseAuth()
  @Post('/filter')
  filter(@Request() req, @Body() filter: FilterOrderDto) {
    return this.ordersService.filter(req.user.uid, filter);
  }

  @GetFirebaseUser(GetFirebaseUserInterceptor.OBJECT, 'creator')
  @UseInterceptors(GetFirebaseUserInterceptor)
  @FirebaseAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Post('/items/:id')
  @HttpCode(201)
  createOrderItem(@Param('id') id: string, @Body() dto: CreateOrderItemDto) {
    return this.ordersService.createItem(+id, dto);
  }

  @Patch('/cancel/:id')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(+id);
  }

  @Patch('/complete/:id')
  complete(@Param('id') id: string) {
    return this.ordersService.complete(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
