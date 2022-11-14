import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Login, LoginDocument } from './schemas/login.schema';
import { StorageService } from '../storageService';
import * as moment from 'moment';

@Injectable()
export class LoginService extends StorageService<Login> {
  constructor(@InjectModel(Login.name) private loginModel: Model<LoginDocument>) {
    super(loginModel);
  }

  async createCode(): Promise<string> {
    const createdCode = await this.create({
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      expiresAt: moment().add('1', 'day').toDate(),
      used: false,
    });

    return createdCode.code;
  }

  async validateCode(codeString: string, onlyUnused: boolean): Promise<boolean> {
    const codes = await this.getAll();
    const code = codes.find((code) => code.code === codeString && code.expiresAt.getTime() > new Date().getTime());
    if (onlyUnused && code?.used) {
      return false;
    }
    const codeExists = !!code;
    if (codeExists) {
      code.used = true;
      await code.save();
    }
    return codeExists;
  }
}
