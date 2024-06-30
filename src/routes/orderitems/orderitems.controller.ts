import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { OrderItemService } from './orderitems.service';
import { UpdateOrderItemDto } from './dto/update-orderitem.dto';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOdItemDto: UpdateOrderItemDto) {
    return this.orderItemService.update(+id, updateOdItemDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.orderItemService.remove(+id);
  }
}
