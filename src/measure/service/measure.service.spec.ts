import { Test, TestingModule } from '@nestjs/testing';
import { MeasureService } from './measure.service';
import { MeasureRepository } from '../../measure/repository/measure.repository';
import { CustomerService } from '../../customer/service/customer.service';
import { MeasureType } from '@prisma/client';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('MeasureService', () => {
  let service: MeasureService;
  let repository: MeasureRepository;
  let customerService: CustomerService;

  const mockMeasure = {
    measure_uuid: 'uuid-1234',
    image: 'http://example.com/image.jpg',
    measure_value: 100,
    measure_type: MeasureType.WATER,
    measure_datetime: new Date(),
    customer_code: 'customer-id-123',
    has_confirmed: false,
  };

  const mockCustomer = {
    id: 'customer-id-123',
    customer_code: 'customer-code-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasureService,
        {
          provide: MeasureRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockMeasure),
            findByCustomerAndMonth: jest.fn().mockResolvedValue(null),
            findAllByCustomer: jest.fn().mockResolvedValue([mockMeasure]),
            findByUUID: jest.fn().mockResolvedValue(mockMeasure),
            update: jest.fn().mockResolvedValue(mockMeasure),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            getCustomerByCode: jest.fn().mockResolvedValue(mockCustomer),
            createCustomer: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    service = module.get<MeasureService>(MeasureService);
    repository = module.get<MeasureRepository>(MeasureRepository);
    customerService = module.get<CustomerService>(CustomerService);
  });

  describe('createMeasure', () => {
    it('should create a new measure', async () => {
      const result = await service.createMeasure(mockMeasure);
      expect(result).toEqual(mockMeasure);
      expect(repository.create).toHaveBeenCalledWith(mockMeasure);
    });
  });

  describe('getMeasureByUUID', () => {
    it('should return a measure by UUID', async () => {
      const result = await service.getMeasureByUUID('uuid-1234');
      expect(result).toEqual(mockMeasure);
      expect(repository.findByUUID).toHaveBeenCalledWith('uuid-1234');
    });

    it('should return null if no measure is found', async () => {
      repository.findByUUID = jest.fn().mockResolvedValue(null);
      const result = await service.getMeasureByUUID('non-existing-uuid');
      expect(result).toBeNull();
    });
  });

  describe('getMeasureByCustomerAndMonth', () => {
    it('should return null if no measure found for the given customer and month', async () => {
      const result = await service.getMeasureByCustomerAndMonth(
        'customer-id-123',
        MeasureType.WATER,
        new Date(),
      );
      expect(result).toBeNull();
      expect(repository.findByCustomerAndMonth).toHaveBeenCalledWith(
        'customer-id-123',
        MeasureType.WATER,
        expect.any(Date),
      );
    });

    it('should return a measure if found', async () => {
      repository.findByCustomerAndMonth = jest
        .fn()
        .mockResolvedValue(mockMeasure);
      const result = await service.getMeasureByCustomerAndMonth(
        'customer-id-123',
        MeasureType.WATER,
        new Date(),
      );
      expect(result).toEqual(mockMeasure);
    });
  });

  describe('updateMeasure', () => {
    it('should update and return the updated measure', async () => {
      const updateData = { measure_value: 150 };
      const result = await service.updateMeasure('uuid-1234', updateData);
      expect(result).toEqual(mockMeasure);
      expect(repository.update).toHaveBeenCalledWith('uuid-1234', updateData);
    });
  });

  describe('getAllMeasuresByCustomer', () => {
    it('should return all measures for a given customer', async () => {
      const result = await service.getAllMeasuresByCustomer('customer-id-123');
      expect(result).toEqual([mockMeasure]);
      expect(repository.findAllByCustomer).toHaveBeenCalledWith(
        'customer-id-123',
        undefined,
      );
    });

    it('should return measures filtered by type if specified', async () => {
      const result = await service.getAllMeasuresByCustomer(
        'customer-id-123',
        MeasureType.WATER,
      );
      expect(result).toEqual([mockMeasure]);
      expect(repository.findAllByCustomer).toHaveBeenCalledWith(
        'customer-id-123',
        MeasureType.WATER,
      );
    });
  });

  describe('validateUploadRequest', () => {
    it('should throw BadRequestException if the request data is invalid', () => {
      expect(() =>
        service['validateUploadRequest']({
          image: '',
          customer_code: '',
          measure_datetime: '',
          measure_type: null,
        } as any),
      ).toThrow(BadRequestException);
    });
  });

  describe('findCustomer', () => {
    it('should return existing customer if found', async () => {
      const customer = await service['findCustomer']('customer-code-123');
      expect(customer).toEqual(mockCustomer);
      expect(customerService.getCustomerByCode).toHaveBeenCalledWith(
        'customer-code-123',
      );
    });

    it('should create and return a new customer if not found', async () => {
      customerService.getCustomerByCode = jest.fn().mockResolvedValue(null);
      const customer = await service['findCustomer']('new-customer-code');
      expect(customer).toEqual(mockCustomer);
      expect(customerService.createCustomer).toHaveBeenCalledWith({
        customer_code: 'new-customer-code',
      });
    });
  });

  describe('checkForExistingMeasure', () => {
    it('should throw ConflictException if an existing measure is found', async () => {
      repository.findByCustomerAndMonth = jest
        .fn()
        .mockResolvedValue(mockMeasure);
      await expect(
        service['checkForExistingMeasure'](
          'customer-code-123',
          MeasureType.WATER,
          new Date(),
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should not throw if no existing measure is found', async () => {
      repository.findByCustomerAndMonth = jest.fn().mockResolvedValue(null);
      await expect(
        service['checkForExistingMeasure'](
          'customer-code-123',
          MeasureType.WATER,
          new Date(),
        ),
      ).resolves.not.toThrow();
    });
  });
});
