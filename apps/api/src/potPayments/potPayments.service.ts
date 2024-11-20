import { Injectable } from '@nestjs/common';
import { PotPayments } from './schemas/potPayments.schema';
import { StorageService } from '../storageService';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PotPaymentsService extends StorageService<PotPayments> {
  constructor(
    @InjectRepository(PotPayments)
    potPaymentsRepository: Repository<PotPayments>,
  ) {
    super(potPaymentsRepository);
  }
}
