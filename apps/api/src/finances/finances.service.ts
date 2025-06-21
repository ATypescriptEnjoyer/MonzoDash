import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FinanceItem, Finances } from './schemas/finances.schema';
import { StorageService } from '../storageService';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MonzoService } from '../monzo/monzo.service';
import async from 'async';
import { generateColour } from '../generateColour';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class FinancesService extends StorageService<Finances> {
  constructor(
    @InjectRepository(Finances)
    financesRepository: Repository<Finances>,
    @InjectRepository(FinanceItem)
    private readonly financesItemRepository: Repository<FinanceItem>,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {
    super(financesRepository);
    this.financesItemRepository = financesItemRepository;
  }

  async getOrderedFinances(): Promise<Finances[]> {
    return this.repository.find(
      { order: { id: { direction: 'ASC' } }, relations: { items: true }, select: { id: true, name: true, colour: true, items: { id: true, name: true, amount: true, financeId: true } } });
  }

  async getFinancesWithAmounts(): Promise<(Omit<Finances, 'items'> & { amountPence: number })[]> {
    const finances = await this.repository.find({ relations: { items: true }, select: { id: true, name: true, colour: true, items: { amount: true } } });
    return finances.map(({ items, ...finance }) => ({
      ...finance,
      amountPence: items.reduce((acc, item) => acc + item.amount, 0),
    }));
  }

  async saveFinanceItems(financeItems: FinanceItem[]): Promise<void> {
    const deletedFinanceItems = await this.financesItemRepository.find({ where: { id: Not(In(financeItems.map((item) => item.id))) } });
    await this.financesItemRepository.remove(deletedFinanceItems);
    await this.financesItemRepository.save(financeItems);
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
          dynamicPot: false,
          items: [],
        });
      }
    });
    console.log('Finished pot name update cycle');
  }
}
