import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerRepository } from '../repository/customer.repository';

describe('CustomerService', () => {
  let service: CustomerService;

  const mockRepository = {
    findByCustomerCode: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: CustomerRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCustomerByCode', () => {
    it('should find a customer by customer code', async () => {
      const customerCode = 'test-customer-code';
      const customer = {
        id: 'test-id',
        customer_code: customerCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByCustomerCode.mockResolvedValue(customer);

      const result = await service.getCustomerByCode(customerCode);

      expect(result).toEqual(customer);
      expect(mockRepository.findByCustomerCode).toHaveBeenCalledWith(
        customerCode,
      );
    });

    it('should return null if no customer is found', async () => {
      const customerCode = 'non-existing-code';

      mockRepository.findByCustomerCode.mockResolvedValue(null);

      const result = await service.getCustomerByCode(customerCode);

      expect(result).toBeNull();
      expect(mockRepository.findByCustomerCode).toHaveBeenCalledWith(
        customerCode,
      );
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const customerData = {
        customer_code: 'new-customer-code',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newCustomer = {
        id: 'new-id',
        ...customerData,
      };

      mockRepository.create.mockResolvedValue(newCustomer);

      const result = await service.createCustomer(customerData);

      expect(result).toEqual(newCustomer);
      expect(mockRepository.create).toHaveBeenCalledWith(customerData);
    });

    it('should throw an error if creation fails', async () => {
      const customerData = {
        customer_code: 'new-customer-code',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockRejectedValue(new Error('Creation failed'));

      await expect(service.createCustomer(customerData)).rejects.toThrow(
        'Creation failed',
      );
      expect(mockRepository.create).toHaveBeenCalledWith(customerData);
    });
  });
});
