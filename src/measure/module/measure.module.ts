import { Module } from '@nestjs/common';
import { MeasureService } from '../service/measure.service';
import { MeasureRepository } from '../repository/measure.repository';
import { PrismaMeasureRepository } from '../../prisma/repositories/prisma-measure.repository';
import { MeasureController } from '../controller/measure.controller';
import { CustomerModule } from '../../customer/module/custumer.module';

@Module({
  imports: [CustomerModule],
  providers: [
    MeasureService,
    { provide: MeasureRepository, useClass: PrismaMeasureRepository },
  ],
  controllers: [MeasureController],
})
export class MeasureModule {}
