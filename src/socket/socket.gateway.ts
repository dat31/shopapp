import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { Server } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class SocketGateway implements OnGatewayInit {
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.socketService.server = server;
  }

  @SubscribeMessage('events')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('events');
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log('identity');
    return data;
  }

  emit() {
    this.server.emit('events', { data: [] });
  }
}
