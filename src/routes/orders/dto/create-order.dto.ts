import { CreateOrderItemDto } from 'routes/orderitems/dto/create-orderitem.dto';
import { User } from 'routes/users/entities/user.entity';

export class CreateOrderDto {
  orderItems: CreateOrderItemDto[];
  user: Pick<User, 'id'>;
  creator: Pick<User, 'id'>;
}
