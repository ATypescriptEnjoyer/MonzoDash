import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonzoModule } from '../monzo/monzo.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth, AuthSchema } from './schemas/auth.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]), forwardRef(() => MonzoModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
