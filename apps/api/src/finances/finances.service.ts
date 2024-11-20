import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Finances } from './schemas/finances.schema';
import { StorageService } from '../storageService';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MonzoService } from '../monzo/monzo.service';
import async from 'async';
import { generateColour } from '../generateColour';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FinancesService extends StorageService<Finances> {
  constructor(
    @InjectRepository(Finances)
    financesRepository: Repository<Finances>,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {
    super(financesRepository);
  }

  async getOrderedFinances(): Promise<Finances[]> {
    return this.repository.find({ order: { id: { direction: 'ASC' } } });
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
          await this.save(matchedPot);
        }
      } else {
        await this.save({
          ...extPot,
          colour: generateColour(),
          amount: 0,
          dynamicPot: false,
        });
      }
    });
    console.log('Finished pot name update cycle');
  }
}
