import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer, EmployerDocument } from './schemas/employer.schema';
import { StorageService } from '../storageService';

@Injectable()
export class EmployerService extends StorageService<Employer> {
  constructor(@InjectModel(Employer.name) private readonly employerModel: Model<EmployerDocument>) {
    super(employerModel);
  }
}
