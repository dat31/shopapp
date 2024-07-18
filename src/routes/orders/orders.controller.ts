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
import { FirebaseAuth } from 'firebase-admin/firebase-auth.decorator';
import { GetCreatorInterceptor } from './get-creator.interceptor';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @FirebaseAuth()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(req.user?.uid, createOrderDto);
  }

  @UseInterceptors(GetCreatorInterceptor)
  @FirebaseAuth()
  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAll(req.user.uid);
  }

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
