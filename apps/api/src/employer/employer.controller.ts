/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Put } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { Employer } from './schemas/employer.schema';

const defaultEmployer: Employer = {
  name: '',
  paidLastWorkingDay: false,
  paidOnHolidays: false,
  payDay: 1,
  remainderPotId: '',
  salary: 0,
};

@Controller('Employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) { }

  @Get()
  async getEmployer(): Promise<Employer> {
    const employers = await this.employerService.getAll();
    return employers.length > 0 ? employers[0] : defaultEmployer;
  }

  @Put()
  async putEmployer(@Body() employerDto: Employer): Promise<Employer> {
    console.log(employerDto);
    const body: Employer = {
      ...employerDto,
      paidOnHolidays: employerDto.paidOnHolidays || false,
      payDay: employerDto.payDay || 31,
      paidLastWorkingDay: employerDto.paidLastWorkingDay || false,
      salary: employerDto.salary || 0,
    };
    const employer = await this.employerService.save(body);
    return employer;
  }
}
