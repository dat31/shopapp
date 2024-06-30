import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderitemsModule } from 'routes/orderitems/orderitems.module';
import { ProductsModule } from 'routes/products/products.module';
import { UsersModule } from 'routes/users/users.module';
import { SocketModule } from 'socket/socket.module';
import { OrderSubscriber } from './subscribers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    OrderitemsModule,
    ProductsModule,
    UsersModule,
    SocketModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderSubscriber],
})
export class OrdersModule {}
