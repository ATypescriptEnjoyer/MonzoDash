import { Injectable } from '@nestjs/common';
import { Transactions } from './schemas/transactions.schema';
import { StorageService } from '../storageService';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TransactionsService extends StorageService<Transactions> {
  constructor(
    @InjectRepository(Transactions)
    transactionsRepository: Repository<Transactions>,
  ) {
    super(transactionsRepository);
  }

  getById = async (id: string) => {
    return this.repository.findOneBy({ id });
  };

  getPage = async (
    page: number,
    count: number,
    columns?: (keyof Transactions)[],
    where?: FindOptionsWhere<Transactions> | FindOptionsWhere<Transactions>[],
  ): Promise<[Transactions[], number]> => {
    return this.repository.findAndCount({
      take: count,
      skip: (page - 1) * count,
      where: where,
      order: {
        created: {
          direction: 'DESC',
        },
      },
      select: columns?.reduce(
        (obj, column) => ({ ...obj, [column]: true }),
        Map<string, boolean>,
      ) as FindOptionsSelect<Transactions>,
    });
  };
}
