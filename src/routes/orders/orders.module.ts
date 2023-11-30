import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderitemsModule } from 'routes/orderitems/orderitems.module';
import { ProductsModule } from 'routes/products/products.module';
import { UsersModule } from 'routes/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    OrderitemsModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
