import { Module } from '@nestjs/common';
import { OrderItemService } from './orderitems.service';
import { OrderItemsController } from './orderitems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderitem.entity';
import { ProductsModule } from 'routes/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem]), ProductsModule],
  controllers: [OrderItemsController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderitemsModule {}
