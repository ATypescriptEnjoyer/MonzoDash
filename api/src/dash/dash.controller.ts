/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, forwardRef, Get, Inject, Put } from '@nestjs/common';
import { DashService } from './dash.service';
import { MonzoService } from '../monzo/monzo.service';
import { Employer } from './schemas/employer.schema';

@Controller('Dash')
export class DashController {
  constructor(
    private readonly dashService: DashService,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {}

  @Get('employer')
  async getEmployer(): Promise<Employer> {
    return this.dashService.getEmployer();
  }

  @Put('employer')
  async putEmployer(@Body() employerDto: Employer) {
    return this.dashService.setEmployer(employerDto);
  }
}
