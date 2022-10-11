import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer, EmployerDocument } from './schemas/employer.schema';
import { Spending, SpendingDocument } from './schemas/spending.schema';

@Injectable()
export class DashService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(Spending.name) private spendingModel: Model<SpendingDocument>,
  ) {}

  async setEmployer(createEmployerDoc: Employer): Promise<Employer> {
    const createdEmployer = new this.employerModel(createEmployerDoc);
    return createdEmployer.save();
  }

  async getEmployer(): Promise<Employer> {
    const employer = await this.employerModel.findOne().exec();
    return employer?.toObject();
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.employerModel.deleteMany().exec();
  }
}
