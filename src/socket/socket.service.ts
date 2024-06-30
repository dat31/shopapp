import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  server: Server;

  emit(data) {
    this.server.emit('events', { data });
  }
}
