import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transactions, TransactionsDocument } from './schemas/transactions.schema';
import { StorageService } from '../storageService';

@Injectable()
export class TransactionsService extends StorageService<Transactions> {
  constructor(@InjectModel(Transactions.name) transactionsModel: Model<TransactionsDocument>) {
    super(transactionsModel);
  }
}
