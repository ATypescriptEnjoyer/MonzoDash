import { Model } from 'mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Finances, FinancesDocument } from './schemas/finances.schema';
import { StorageService } from '../storageService';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MonzoService } from '../monzo/monzo.service';
import async from 'async';
import { generateColour } from '../generateColour';

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
    await async.forEachSeries(newPots, async (extPot) => {
      const matchedPot = existingPots.find((pot) => pot.id === extPot.id);
      if (matchedPot) {
        if (extPot.deleted) {
          await this.delete(matchedPot);
        } else {
          matchedPot.name = extPot.name;
          await matchedPot.save();
        }
      }
      else {
        this.create({
          ...extPot,
          colour: generateColour(),
          amount: 0,
          dynamicPot: false
        });
      }
    });
    console.log('Finished pot name update cycle');
  }
}
