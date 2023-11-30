import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private repository: Repository<Payment>,
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    return this.repository.create(createPaymentDto);
  }

  findAll() {
    return this.repository.find({ relations: { order: true } });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return this.repository.update(id, updatePaymentDto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
