import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer } from '@prisma/client';
import { CustomerRepository } from '../customer.repository';
import { CreateCustomerDto } from 'src/dto/customer.dto';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCustomerCode(customer_code: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { customer_code },
    });
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({
      data,
    });
  }
}
