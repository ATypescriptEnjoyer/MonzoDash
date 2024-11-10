/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Put } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { Employer } from './schemas/employer.schema';

@Controller('Employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) { }

  @Get()
  async getEmployer(): Promise<Employer> {
    return await this.employerService.getAll()[0] ?? null;
  }

  @Put()
  async putEmployer(@Body() employerDto: Employer): Promise<Employer> {
    const body: Employer = { ...employerDto, paidOnHolidays: employerDto.paidOnHolidays || false, payDay: employerDto.payDay || 31, paidLastWorkingDay: employerDto.paidLastWorkingDay || false }
    const employer = await this.employerService.save(body);
    return employer;
  }
}
