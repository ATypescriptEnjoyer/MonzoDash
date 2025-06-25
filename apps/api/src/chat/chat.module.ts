import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { LoginModule } from '../login/login.module';

@Module({
  imports: [TransactionsModule, LoginModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule { }