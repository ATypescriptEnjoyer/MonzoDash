import { Module } from '@nestjs/common';
import { ActualbudgetService } from './actualbudget.service';

@Module({
    imports: [],
    controllers: [],
    providers: [ActualbudgetService],
    exports: [ActualbudgetService],
})
export class ActualbudgetModule { }