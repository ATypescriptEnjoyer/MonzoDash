import { Module } from '@nestjs/common';
import { MonzoModule } from '../monzo/monzo.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginSchema } from './schemas/login.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LoginSchema]), MonzoModule],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule { }
