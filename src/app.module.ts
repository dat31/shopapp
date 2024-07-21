import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'routes/products/products.module';
import { CategoriesModule } from 'routes/categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'routes/users/users.module';
import { OrdersModule } from 'routes/orders/orders.module';
import { OrderitemsModule } from 'routes/orderitems/orderitems.module';
import { EmployeeSchedule } from 'routes/employee-schedules/entities/employee-schedule.entity';
import { PaymentsModule } from 'routes/payments/payments.module';
import { EmployeeSchedulesModule } from 'routes/employee-schedules/employee-schedules.module';
import { SocketModule } from './socket/socket.module';
import { S3Module } from './s3/s3.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
    OrdersModule,
    OrderitemsModule,
    EmployeeSchedule,
    PaymentsModule,
    EmployeeSchedulesModule,
    SocketModule,
    S3Module,
    FirebaseAdminModule,
  ],
})
export class AppModule {}
