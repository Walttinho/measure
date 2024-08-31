import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MeasureModule } from './measure/module/measure.module';
import { CustomerModule } from './customer/module/custumer.module';

@Module({
  imports: [PrismaModule, CustomerModule, MeasureModule],

  controllers: [],

  providers: [],
})
export class AppModule {}
