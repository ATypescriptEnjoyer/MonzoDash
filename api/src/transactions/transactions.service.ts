import { Injectable } from '@nestjs/common';
import { Transactions } from './schemas/transactions.schema';
import { StorageService } from '../storageService';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService extends StorageService<Transactions> {
  constructor(@InjectRepository(Transactions)
  transactionsRepository: Repository<Transactions>,) {
    super(transactionsRepository);
  }
}
