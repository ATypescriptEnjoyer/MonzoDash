import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Login, LoginDocument } from './schemas/login.schema';
import { StorageService } from '../storageService';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';
import { sha512 } from 'sha512-crypt-ts';

@Injectable()
export class LoginService extends StorageService<Login> {
  constructor(@InjectModel(Login.name) private loginModel: Model<LoginDocument>) {
    super(loginModel);
  }

  @Cron('0 0 * * *')
  async clearCodes(): Promise<void> {
    console.log('Running login code clear cycle');
    const deleted = await this.loginModel.deleteMany({ $or: [{ expiresAt: { $lt: new Date() } }, { used: false }] });
    console.log(`${deleted.deletedCount} expired logins deleted.`);
  }

  async createCode(): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = sha512.crypt(code, process.env.CRYPT_SALT || 'monzodash');
    await this.create({
      code: codeHash,
      createdAt: new Date(),
      expiresAt: moment().add('1', 'month').toDate(),
      used: false,
    });

    return code;
  }

  async validateCode(codeString: string, onlyUnused: boolean): Promise<boolean> {
    const codeHash = sha512.crypt(codeString, process.env.CRYPT_SALT || 'monzodash');
    const codes = await this.getAll();
    const code = codes.find((code) => code.code === codeHash && code.expiresAt.getTime() > new Date().getTime());
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
