import { CreateOrderItemDto } from 'routes/orderitems/dto/create-orderitem.dto';
import { User } from 'routes/users/entities/user.entity';

export class CreateOrderDto {
  odItems: CreateOrderItemDto[];
  userId: User['id'];
}
