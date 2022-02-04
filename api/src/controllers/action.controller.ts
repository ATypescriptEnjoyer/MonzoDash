/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AutomationRecord } from '@prisma/client';
import { AutomationRecordService } from '../services/automationRecord.service';

@Controller('actions')
export class ActionController {
  constructor(private readonly automationRecordService: AutomationRecordService) {}

  @Get('getAll')
  async getAll(): Promise<AutomationRecord[]> {
    const actions = await this.automationRecordService.getAll();
    return actions;
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<{ success: boolean }> {
    const canDelete = await this.automationRecordService.deleteAutomationRecord({ id: +id });
    return { success: !!canDelete };
  }
}
