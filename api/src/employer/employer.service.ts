import { Injectable } from '@nestjs/common';
import { Employer } from './schemas/employer.schema';
import { StorageService } from '../storageService';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmployerService extends StorageService<Employer> {
  constructor(
    @InjectRepository(Employer)
    authRepository: Repository<Employer>,
  ) {
    super(authRepository);
  }
}
