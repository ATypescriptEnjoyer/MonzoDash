import { Module } from '@nestjs/common';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { EmployerSchema } from './schemas/employer.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerSchema])],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
