import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'routes/products/products.module';
import { CategoriesModule } from 'routes/categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'auth/auth.module';
import { UsersModule } from 'routes/users/users.module';
import { OrdersModule } from 'routes/orders/orders.module';
import { OrderitemsModule } from 'routes/orderitems/orderitems.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    OrderitemsModule,
  ],
})
export class AppModule {}
