import { Injectable } from '@nestjs/common';
import { Login } from './schemas/login.schema';
import { StorageService } from '../storageService';
import * as moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sha512 } from 'sha512-crypt-ts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService extends StorageService<Login> {
  constructor(
    @InjectRepository(Login)
    loginRepository: Repository<Login>,
  ) {
    super(loginRepository);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearCodes(): Promise<void> {
    console.log('Running login code clear cycle');
    const deleted = await this.repository.createQueryBuilder()
      .delete()
      .where("expiresAt < :currentDate", { currentDate: new Date() })
      .orWhere("used = :used", { used: false })
      .execute();
    console.log(`${deleted.affected} expired logins deleted.`);
  }

  async createCode(): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = sha512.crypt(code, process.env.CRYPT_SALT || 'monzodash');
    await this.save({
      code: codeHash,
      createdAt: new Date(),
      expiresAt: moment().add('1', 'month').toDate(),
      used: false,
    } as unknown as Login);

    return code;
  }

  async validateCode(codeString: string, onlyUnused: boolean): Promise<boolean> {
    const codeHash = sha512.crypt(codeString, process.env.CRYPT_SALT || 'monzodash');
    const codes = await this.getAll();
    const code = codes.find((code) => code.code === codeHash && new Date(code.expiresAt).getTime() > new Date().getTime());
    if (onlyUnused && code?.used) {
      return false;
    }
    const codeExists = !!code;
    if (codeExists) {
      code.used = true;
      await this.save(code);
    }
    return codeExists;
  }
}
