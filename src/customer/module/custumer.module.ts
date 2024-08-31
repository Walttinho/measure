import { Module } from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { CustomerRepository } from '../repository/customer.repository';
import { PrismaCustomerRepository } from '../../prisma/repositories/prisma-customer.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CustomerService,
    { provide: CustomerRepository, useClass: PrismaCustomerRepository },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
