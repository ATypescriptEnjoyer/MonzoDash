/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Put } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { Employer } from './schemas/employer.schema';

@Controller('Employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get()
  async get(): Promise<Employer> {
    const employers = await this.employerService.getAll();
    return employers.length > 0 ? employers[0] : null;
  }

  @Put()
  async put(@Body() employerDto: Employer): Promise<Employer> {
    const employer = await this.employerService.create(employerDto);
    return employer;
  }
}
