import { Customer } from '@prisma/client';

export abstract class CustomerRepository {
  abstract findByCustomerCode(customer_code: string): Promise<Customer | null>;
  abstract create(data: Partial<Customer>): Promise<Customer>;
}
