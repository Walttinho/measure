import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../customer/repository/customer.repository';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from '../../customer/dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async getCustomerByCode(customer_code: string): Promise<Customer | null> {
    return this.customerRepository.findByCustomerCode(customer_code);
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    return this.customerRepository.create(data);
  }
}
