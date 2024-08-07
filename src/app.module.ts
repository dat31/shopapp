import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'routes/products/products.module';
import { CategoriesModule } from 'routes/categories/categories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'routes/users/users.module';
import { OrdersModule } from 'routes/orders/orders.module';
import { OrderitemsModule } from 'routes/orderitems/orderitems.module';
import { EmployeeSchedule } from 'routes/employee-schedules/entities/employee-schedule.entity';
import { PaymentsModule } from 'routes/payments/payments.module';
import { EmployeeSchedulesModule } from 'routes/employee-schedules/employee-schedules.module';
import { SocketModule } from './socket/socket.module';
import { S3Module } from './s3/s3.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PW'),
          database: configService.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
