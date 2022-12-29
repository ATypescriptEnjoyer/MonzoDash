import { Model } from 'mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Finances, FinancesDocument } from './schemas/finances.schema';
import { StorageService } from '../storageService';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MonzoService } from 'src/monzo/monzo.service';
import async from 'async';

@Injectable()
export class FinancesService extends StorageService<Finances> {
  constructor(
    @InjectModel(Finances.name) private financesModel: Model<FinancesDocument>,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {
    super(financesModel);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updatePotNames(): Promise<void> {
    console.log('Running pot name update cycle');
    const existingPots = await this.getAll();
    const newPots = await this.monzoService.getPots();
    await async.forEachSeries(existingPots, async (finance) => {
      const matchedPot = newPots.find((newPot) => newPot.id === finance.id);
      if (matchedPot) {
        if (matchedPot.deleted) {
          finance.delete();
        } else {
          finance.name = matchedPot.name;
          await finance.save();
        }
      }
    });
    console.log('Finished pot name update cycle');
  }
}
