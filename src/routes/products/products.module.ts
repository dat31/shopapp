import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from 'routes/products/entities/product.entity';
import { Category } from 'routes/categories/entities/category.entity';
import { ConfigModule } from '@nestjs/config';
import { OrderItem } from 'routes/orderitems/entities/orderitem.entity';
import { SocketModule } from 'socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, OrderItem]),
    ConfigModule,
    SocketModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
