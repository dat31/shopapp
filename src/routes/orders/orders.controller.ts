import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderItemDto } from 'routes/orderitems/dto/create-orderitem.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
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
