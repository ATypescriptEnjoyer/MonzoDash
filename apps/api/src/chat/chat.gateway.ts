import { ChatService } from './chat.service';
import { TransactionsService } from '../transactions/transactions.service';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LoginService } from '../login/login.service';
import { v4 as uuidv4 } from 'uuid';
import { LessThan } from 'typeorm';

@WebSocketGateway({
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly transactionsService: TransactionsService,
    private readonly loginService: LoginService
  ) {
  }
  async handleConnection(client: Socket) {
    const token: string = client.handshake.auth.token || client.handshake.query.token;

    if (!process.env.OLLAMA_BASE_URL) {
      client.emit('error', 'OLLAMA_BASE_URL is not set');
      client.disconnect(true);
      return;
    }

    if (!token) {
      client.disconnect();
      return;
    }

    const valid = await this.loginService.validateCode(token, false);
    if (!valid) {
      client.disconnect();
      return;
    }
  }

  @SubscribeMessage('chat')
  async handleEvent(@MessageBody() payload: string, @ConnectedSocket() client: Socket): Promise<void> {
    const messageId = uuidv4();
    let thinking = true;
    client.emit('chat', { id: messageId, chunk: "", done: false, thinking });
    const transactions = await this.transactionsService.repository.find({
      select: ['amount', 'created', 'description'],
      where: {
        type: 'outgoing'
      }
    });
    const stream = await this.chatService.chat(payload, transactions);
    for await (const chunk of stream) {
      if (chunk === "</think>") {
        thinking = false;
      }
      if (thinking || chunk === "</think>") {
        continue;
      }
      client.emit('chat', { id: messageId, chunk, done: false, thinking });
    }
    client.emit('chat', { id: messageId, chunk: "", done: true, thinking });
  }
}