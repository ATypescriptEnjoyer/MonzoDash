import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { MonzoService } from '../monzo/monzo.service';
import moment from 'moment';
import { StorageService } from '../storageService';

@Injectable()
export class AuthService extends StorageService<Auth> {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {
    super(authModel);
  }

  async getLatestToken(): Promise<AuthDocument> {
    const query = await this.authModel.findOne().sort({ createdAt: 'descending' }).exec();
    if (query) {
      if (new Date().getTime() > query.expiresIn.getTime()) {
        const newTokenInfo = await this.monzoService.refreshToken({ refreshToken: query.refreshToken });
        query.authToken = newTokenInfo.accessToken;
        query.refreshToken = newTokenInfo.refreshToken;
        query.expiresIn = moment().add(newTokenInfo.expiresIn, 'seconds').toDate();
      }
      await this.save(query);
      return query;
    }
    return null;
  }
}
