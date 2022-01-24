/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AutomationRecord, Prisma } from '@prisma/client';

@Injectable()
export class AutomationRecordService {
  constructor(private prisma: PrismaService) {}

  async automationRecord(
    userWhereUniqueInput: Prisma.AutomationRecordWhereUniqueInput,
  ): Promise<AutomationRecord | null> {
    return this.prisma.automationRecord.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createAutomationRecord(data: Prisma.AutomationRecordCreateInput): Promise<AutomationRecord> {
    return this.prisma.automationRecord.create({
      data,
    });
  }

  async updateAutomationRecord(params: {
    where: Prisma.AutomationRecordWhereUniqueInput;
    data: Prisma.AutomationRecordUpdateInput;
  }): Promise<AutomationRecord> {
    const { where, data } = params;
    return this.prisma.automationRecord.update({
      data,
      where,
    });
  }

  async deleteAutomationRecord(where: Prisma.AutomationRecordWhereUniqueInput): Promise<AutomationRecord> {
    return this.prisma.automationRecord.delete({
      where,
    });
  }
}
