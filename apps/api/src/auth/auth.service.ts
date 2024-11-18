import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Auth } from './schemas/auth.schema';
import { AuthResponse, MonzoService } from '../monzo/monzo.service';
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

  async createToken(response: AuthResponse): Promise<Auth> {
    await this.deleteAll();
    const token: Auth = {
      authToken: response.accessToken,
      refreshToken: response.refreshToken,
      createdAt: new Date(),
      expiresIn: new Date(Date.now() + response.expiresIn * 1000),
      twoFactored: false,
    };
    return this.authRepository.save(token);
  }

  async getToken(): Promise<Auth | null> {
    const [token] = await this.authRepository.find({ order: { createdAt: 'DESC' } });
    if (!token) {
      return null;
    }
    if (Date.now() < new Date(token.expiresIn).getTime()) {
      return token;
    }
    const refreshedToken = await this.monzoService.refreshToken({ refreshToken: token.refreshToken });
    return this.createToken(refreshedToken);
  }
}
