import { Measure, MeasureType } from '@prisma/client';

export abstract class MeasureRepository {
  abstract findByUUID(measure_uuid: string): Promise<Measure | null>;
  abstract findByCustomerAndMonth(
    customer_code: string,
    measureType: MeasureType,
    month: Date,
  ): Promise<Measure | null>;
  abstract create(data: Partial<Measure>): Promise<Measure>;
  abstract update(
    measure_uuid: string,
    data: Partial<Measure>,
  ): Promise<Measure>;
  abstract findAllByCustomer(
    customer_code: string,
    measureType?: MeasureType,
  ): Promise<Measure[]>;
}
