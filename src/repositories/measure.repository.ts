import { Measure, MeasureType } from '@prisma/client';

export abstract class MeasureRepository {
  abstract findByUUID(measure_uuid: string): Promise<Measure | null>;
  abstract findByCustomerAndMonth(
    customerId: string,
    measureType: MeasureType,
    month: Date,
  ): Promise<Measure | null>;
  abstract create(data: Partial<Measure>): Promise<Measure>;
  abstract update(
    measure_uuid: string,
    data: Partial<Measure>,
  ): Promise<Measure>;
  abstract findAllByCustomer(
    customerId: string,
    measureType?: MeasureType,
  ): Promise<Measure[]>;
}
