/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Auth, Prisma } from '@prisma/client';

export interface AccessToken {
  type: 'AUTH' | 'REFRESH';
  value: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async authRecord(userWhereUniqueInput: Prisma.AuthWhereUniqueInput): Promise<Auth | null> {
    return this.prisma.auth.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getAccessToken(): Promise<AccessToken | null> {
    const latestValid = await this.prisma.auth.findFirst({ where: { expiresIn: { gt: new Date() } } });
    if (!latestValid?.id) {
      const refreshToken = await this.prisma.auth.findFirst({ orderBy: { id: 'desc' } });
      return { type: 'REFRESH', value: refreshToken.refreshToken };
    }
    return { type: 'AUTH', value: latestValid.authToken };
  }

  async createAuthRecord(data: Prisma.AuthCreateInput): Promise<Auth> {
    return this.prisma.auth.create({
      data,
    });
  }

  async updateAuthRecord(params: { where: Prisma.AuthWhereUniqueInput; data: Prisma.AuthUpdateInput }): Promise<Auth> {
    const { where, data } = params;
    return this.prisma.auth.update({
      data,
      where,
    });
  }

  async deleteAuthRecord(where: Prisma.AuthWhereUniqueInput): Promise<Auth> {
    return this.prisma.auth.delete({
      where,
    });
  }
}
