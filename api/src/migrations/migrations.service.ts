import { Model } from 'mongoose';
import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Migrations, MigrationsDocument } from './schemas/migrations.schema';
import { StorageService } from '../storageService';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionsDocument } from 'src/transactions/schemas/transactions.schema';
import * as async from 'async';

@Injectable()
export class MigrationsService extends StorageService<Migrations> implements OnModuleInit {
  constructor(
    @InjectModel(Migrations.name) private migrationsModel: Model<MigrationsDocument>,
    @Inject(forwardRef(() => TransactionsService)) private readonly transactionsService: TransactionsService,
  ) {
    super(migrationsModel);
  }
  async onModuleInit() {
    const ranMigrations = (await this.getAll()).map((ranMigration) => ranMigration.migration);
    const migrationsToRun = this.migrations.filter((migration) => !ranMigrations.includes(migration.name));
    console.log(`${migrationsToRun.length} migrations to run.`);
    async.forEachSeries(migrationsToRun, async ({ name, run }) => {
      console.log('Running migration: ', name);
      await run();
      await this.create({ migration: name, date_ran: new Date() });
    });
  }

  migrations: { name: string; run: () => Promise<void> }[] = [
    {
      name: '20221929-Update-Transactions',
      run: async () => {
        const transactions = await this.transactionsService.getAll();
        if (!transactions) {
          return;
        }
        async.eachSeries(transactions, async (transaction: TransactionsDocument) => {
          transaction.internal = transaction.transaction ? transaction.transaction.scheme === 'uk_retail_pot' : false;
          await transaction.save();
        });
      },
    },
  ];
}
