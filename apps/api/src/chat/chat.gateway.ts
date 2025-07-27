import { ChatService } from './chat.service';
import { TransactionsService } from '../transactions/transactions.service';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LoginService } from '../login/login.service';
import { v4 as uuidv4 } from 'uuid';
import { FindOperator, In, IsNull, Like, MoreThanOrEqual, Not, Or } from 'typeorm';
import dayjs from 'dayjs';
import { TransactionType, TransactionTypes } from '../transactions/transactionTypes';

const parseCategoriesFromPrompt = (prompt: string): TransactionType[] => {
  const promptToLower = prompt.toLowerCase();
  const categories = TransactionTypes.filter((category) => promptToLower.includes(category));
  return categories;
}

const parseMerchantsFromPrompt = (prompt: string): FindOperator<string>[] => {
  const promptToLower = prompt.toLowerCase();
  const words = promptToLower.split(' ');
  const merchants: FindOperator<string>[] = [];
  for (let i = 0; i < words.length - 2; i++) {
    if (words[i] === 'at' || words[i] === 'on') {
      const merchant = words[i + 1];
      const cleanedMerchant = merchant.replace(/[^a-zA-Z0-9-\s]/g, '').trim();
      if (!TransactionTypes.includes(cleanedMerchant as TransactionType)) {
        merchants.push(Like(`%${cleanedMerchant}%`));
      }
    }
  }
  return merchants;
}

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
    const categories = parseCategoriesFromPrompt(payload);
    const merchants = parseMerchantsFromPrompt(payload);


    const transactions = await this.transactionsService.repository.find({
      select: ['id', 'amount', 'created', 'description', 'category'],
      where: {
        type: 'outgoing',
        category: categories.length > 0 ? In(categories) : Not(IsNull()),
        created: MoreThanOrEqual(
          dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        ),
        description: merchants.length > 0 ? Or(...merchants) : Not(IsNull()),
      },
      order: {
        created: 'DESC',
      },
    });
    const { response } = await this.chatService.chat(payload, transactions);
    client.emit('chat', { id: messageId, response });
  }
}