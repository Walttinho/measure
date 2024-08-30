import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Measure, MeasureType } from '@prisma/client';
import { MeasureRepository } from '../measure.repository';
import { CreateMeasureDto, UpdateMeasureDto } from 'src/dto/measure.dto';

@Injectable()
export class PrismaMeasureRepository implements MeasureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUUID(measure_uuid: string): Promise<Measure | null> {
    return this.prisma.measure.findUnique({
      where: { measure_uuid },
    });
  }

  async findByCustomerAndMonth(
    customerId: string,
    measureType: MeasureType,
    month: Date,
  ): Promise<Measure | null> {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    return this.prisma.measure.findFirst({
      where: {
        customerId,
        measure_type: measureType,
        measure_datetime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  }

  async create(data: CreateMeasureDto): Promise<Measure> {
    return this.prisma.measure.create({
      data,
    });
  }

  async update(measure_uuid: string, data: UpdateMeasureDto): Promise<Measure> {
    return this.prisma.measure.update({
      where: { measure_uuid },
      data,
    });
  }

  async findAllByCustomer(
    customerId: string,
    measureType?: MeasureType,
  ): Promise<Measure[]> {
    const whereClause = measureType
      ? { customerId, measure_type: measureType }
      : { customerId };

    return this.prisma.measure.findMany({
      where: whereClause,
    });
  }
}
