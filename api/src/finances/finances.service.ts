import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Finances, FinancesDocument } from './schemas/finances.schema';
import { StorageService } from '../storageService';

@Injectable()
export class FinancesService extends StorageService<Finances> {
  constructor(@InjectModel(Finances.name) financesModel: Model<FinancesDocument>) {
    super(financesModel);
  }
}
