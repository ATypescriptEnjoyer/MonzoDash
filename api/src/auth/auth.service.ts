import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Auth } from './schemas/auth.schema';
import { MonzoService } from '../monzo/monzo.service';
import { StorageService } from '../storageService';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService extends StorageService<Auth> {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {
    super(authRepository);
  }

  async getLatestToken(): Promise<Auth> {
    const allTokens = await this.authRepository.find({ order: { createdAt: "DESC" } });
    if (allTokens.length > 0) {
      var query = allTokens[0];
      var currentDate = new Date();
      if (currentDate.getTime() >= new Date(query.expiresIn).getTime()) {
        try {
          const newTokenInfo = await this.monzoService.refreshToken({ refreshToken: query.refreshToken });
          query.authToken = newTokenInfo.accessToken;
          query.refreshToken = newTokenInfo.refreshToken;
          currentDate.setSeconds(currentDate.getSeconds() + newTokenInfo.expiresIn);
          query.expiresIn = currentDate.toISOString();
          await this.save(query);
        } catch (error) {
          return null;
        }
      }
      return query;
    }
    return null;
  }
}
