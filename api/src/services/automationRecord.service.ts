/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Action, AutomationRecord, Prisma, Trigger } from '@prisma/client';

@Injectable()
export class AutomationRecordService {
  constructor(private prisma: PrismaService) {}

  async automationRecord(userWhereUniqueInput: Prisma.AutomationRecordWhereUniqueInput): Promise<
    AutomationRecord & {
      triggers: Trigger[];
      actions: Action[];
    }
  > {
    return this.prisma.automationRecord.findUnique({
      where: userWhereUniqueInput,
      include: {
        actions: true,
        triggers: true,
      },
    });
  }

  async getAll(where?: Prisma.AutomationRecordWhereUniqueInput): Promise<
    (AutomationRecord & {
      triggers: Trigger[];
      actions: Action[];
      lastRan: Date;
    })[]
  > {
    const records = await this.prisma.automationRecord.findMany({
      where,
      include: {
        actions: true,
        triggers: true,
        history: {
          take: 1,
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return records.map((record) => ({
      id: record.id,
      name: record.name,
      actions: record.actions,
      triggers: record.triggers,
      createdAt: record.createdAt,
      lastRan: record.history.length > 0 ? record.history[0].createdAt : null,
    }));
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
