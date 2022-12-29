import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationsService } from './migrations.service';
import { Migrations, MigrationsSchema } from './schemas/migrations.schema';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Migrations.name, schema: MigrationsSchema }]), TransactionsModule],
  controllers: [],
  providers: [MigrationsService],
  exports: [MigrationsService],
})
export class MigrationsModule {}
