import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { Employer, EmployerSchema } from './schemas/employer.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Employer.name, schema: EmployerSchema }])],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
