import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Measure, MeasureType } from '@prisma/client';
import { MeasureRepository } from '../../measure/repository/measure.repository';
import {
  CreateMeasureDto,
  UpdateMeasureDto,
} from '../../measure/dto/measure.dto';

@Injectable()
export class PrismaMeasureRepository implements MeasureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUUID(measure_uuid: string): Promise<Measure | null> {
    return this.prisma.measure.findUnique({
      where: { measure_uuid },
    });
  }

  async findByCustomerAndMonth(
    customer_id: string,
    measureType: MeasureType,
    month: Date,
  ): Promise<Measure | null> {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    return this.prisma.measure.findFirst({
      where: {
        customer_id,
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
    customer_code: string,
    measureType?: MeasureType,
  ): Promise<Measure[]> {
    const whereClause = measureType
      ? { customer_code, measure_type: measureType }
      : { customer_code };

    return this.prisma.measure.findMany({
      where: whereClause,
    });
  }
}
