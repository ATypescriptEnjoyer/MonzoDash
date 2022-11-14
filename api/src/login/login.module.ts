import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonzoModule } from 'src/monzo/monzo.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { Login, LoginSchema } from './schemas/login.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Login.name, schema: LoginSchema }]), MonzoModule],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
