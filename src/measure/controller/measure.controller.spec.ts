import { Test, TestingModule } from '@nestjs/testing';
import { MeasureController } from './measure.controller';
import { MeasureService } from '../service/measure.service';
import { MeasureType } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('MeasureController', () => {
  let controller: MeasureController;
  let measureService: MeasureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasureController],
      providers: [
        {
          provide: MeasureService,
          useValue: {
            readMeasure: jest.fn(),
            confirmMeasure: jest.fn(),
            listMeasures: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MeasureController>(MeasureController);
    measureService = module.get<MeasureService>(MeasureService);
  });

  describe('uploadMeasure', () => {
    it('should return measure details on successful upload', async () => {
      const dto = {
        image: 'image_data',
        customer_code: 'customer_code',
        measure_type: MeasureType.WATER,
        measure_datetime: new Date().toISOString(),
      };

      const result = { measure_uuid: 'uuid-123', measure_value: 100 };
      jest
        .spyOn(measureService, 'readMeasure')
        .mockResolvedValue(result as any);

      expect(await controller.readMeasure(dto as any)).toEqual(result);
      expect(measureService.readMeasure).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException for invalid data', async () => {
      jest.spyOn(measureService, 'readMeasure').mockImplementation(() => {
        throw new BadRequestException();
      });

      await expect(controller.readMeasure({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if measure already exists', async () => {
      jest.spyOn(measureService, 'readMeasure').mockImplementation(() => {
        throw new ConflictException();
      });

      await expect(controller.readMeasure({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(measureService, 'readMeasure').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(controller.readMeasure({} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if LLM API call fails', async () => {
      jest.spyOn(measureService, 'readMeasure').mockImplementation(() => {
        throw new BadRequestException('LLM API Error');
      });

      await expect(controller.readMeasure({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('confirmMeasure', () => {
    it('should confirm the measure successfully', async () => {
      const dto = { measure_uuid: 'uuid-123', confirmed_value: 100 };
      jest
        .spyOn(measureService, 'confirmMeasure')
        .mockResolvedValue({ success: true });

      expect(await controller.confirmMeasure(dto)).toEqual({ success: true });
      expect(measureService.confirmMeasure).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException for invalid data', async () => {
      jest.spyOn(measureService, 'confirmMeasure').mockImplementation(() => {
        throw new BadRequestException();
      });

      await expect(controller.confirmMeasure({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if measure not found', async () => {
      jest.spyOn(measureService, 'confirmMeasure').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(controller.confirmMeasure({} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if measure already confirmed', async () => {
      jest.spyOn(measureService, 'confirmMeasure').mockImplementation(() => {
        throw new ConflictException();
      });

      await expect(controller.confirmMeasure({} as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('listMeasures', () => {
    it('should return measures for a customer', async () => {
      const customer_code = 'customer_code';
      const measures = [
        { measure_uuid: 'uuid-123', measure_type: MeasureType.WATER },
      ];
      jest
        .spyOn(measureService, 'listMeasures')
        .mockResolvedValue(measures as any);

      expect(await controller.listMeasures(customer_code)).toEqual(measures);
      expect(measureService.listMeasures).toHaveBeenCalledWith(
        customer_code,
        undefined,
      );
    });

    it('should throw BadRequestException for invalid measure_type', async () => {
      jest.spyOn(measureService, 'listMeasures').mockImplementation(() => {
        throw new BadRequestException();
      });

      await expect(controller.listMeasures('customer_code')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(measureService, 'listMeasures').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(controller.listMeasures('customer_code')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if no measures found', async () => {
      jest.spyOn(measureService, 'listMeasures').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(controller.listMeasures('customer_code')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
