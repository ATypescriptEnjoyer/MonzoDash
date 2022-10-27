import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Holiday, HolidaysDocument } from './schemas/holidays.schema';
import { StorageService } from '../storageService';

@Injectable()
export class HolidaysService extends StorageService<Holiday> {
  constructor(@InjectModel(Holiday.name) private holidaysModel: Model<HolidaysDocument>) {
    super(holidaysModel);
  }

  createBulk = async (obj: Holiday[]): Promise<Holiday[]> => {
    return await this.holidaysModel.insertMany(obj);
  };
}
