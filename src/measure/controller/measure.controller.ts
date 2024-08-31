import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MeasureType } from '@prisma/client';
import { MeasureService } from '../service/measure.service';
import { ConfirmMeasureDto, CreateMeasureRequestDto } from '../dto/measure.dto';

@Controller('measure')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  async readMeasure(@Body() body: CreateMeasureRequestDto) {
    return this.measureService.readMeasure(body);
  }

  @Patch('confirm')
  async confirmMeasure(@Body() body: ConfirmMeasureDto) {
    return this.measureService.confirmMeasure(body);
  }

  @Get(':customer_code/list')
  async listMeasures(
    @Param('customer_code') customer_code: string,
    @Query('measure_type') measure_type?: MeasureType,
  ) {
    return this.measureService.listMeasures(customer_code, measure_type);
  }
}
