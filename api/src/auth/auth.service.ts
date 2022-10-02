import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { MonzoService } from '../monzo/monzo.service';
import moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {}

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
    if (query) {
      const queryObj = query.toObject<Auth>();
      if (new Date().getTime() > queryObj.expiresIn.getTime()) {
        const newTokenInfo = await this.monzoService.refreshToken({ refreshToken: queryObj.refreshToken });
        queryObj.authToken = newTokenInfo.accessToken;
        queryObj.refreshToken = newTokenInfo.refreshToken;
        queryObj.expiresIn = moment().add(newTokenInfo.expiresIn, 'seconds').toDate();
      }
      await this.save(queryObj);
      return queryObj;
    }
    return null;
  }

  async save(saveAuthDoc: Auth): Promise<Auth> {
    return this.authModel.findOneAndUpdate({ authToken: saveAuthDoc.authToken }, { $set: { ...saveAuthDoc } }).exec();
  }
}
