import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Order } from '../entities/order.entity';
import { SocketService } from 'socket/socket.service';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  constructor(
    dataSource: DataSource,
    private socketService: SocketService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Order;
  }

  beforeInsert(event: InsertEvent<Order>) {
    console.log(`BEFORE USER INSERTED: `, event.entity);
  }

  afterInsert(event: InsertEvent<Order>): void | Promise<any> {
    this.socketService.emit(event.entity);
    console.log(`BEFORE USER INSERTED: `, event.entity);
  }
}
