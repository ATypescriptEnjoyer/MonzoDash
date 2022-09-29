import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>) {}

  async create(createAuthDoc: Auth): Promise<Auth> {
    const createdAuth = new this.authModel(createAuthDoc);
    return createdAuth.save();
  }

  async findAll(): Promise<Auth[]> {
    return this.authModel.find().exec();
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.authModel.deleteMany().exec();
  }

  async getLatestToken(): Promise<Auth> {
    const query = await this.authModel.findOne().sort({ createdAt: 'descending' }).exec();
    return query?.toObject();
  }

  async save(saveAuthDoc: Auth): Promise<Auth> {
    return this.authModel.findOneAndUpdate({ authToken: saveAuthDoc.authToken }, { $set: { ...saveAuthDoc } }).exec();
  }
}
