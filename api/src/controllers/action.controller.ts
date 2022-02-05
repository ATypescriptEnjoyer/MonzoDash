/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AutomationRecord, TriggerOption } from '@prisma/client';
import { AutomationRecordService } from '../services/automationRecord.service';
import { PrismaService } from '../services/prisma.service';

@Controller('actions')
export class ActionController {
  constructor(private prismaService: PrismaService, private automationRecordService: AutomationRecordService) {}

  @Get('getAll')
  async getAll(): Promise<AutomationRecord[]> {
    return this.automationRecordService.getAll();
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<{ success: boolean }> {
    const canDelete = await this.automationRecordService.deleteAutomationRecord({ id: +id });
    return { success: !!canDelete };
  }

  @Get('options')
  async options(): Promise<TriggerOption[]> {
    return this.prismaService.triggerOption.findMany();
  }
}
