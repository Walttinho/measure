import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { MeasureType } from '@prisma/client';
import { MeasureService } from '../service/measure.service';
import { ConfirmMeasureDto, CreateMeasureRequestDto } from '../dto/measure.dto';

@ApiTags('Medidas')
@Controller('measure')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload de uma nova medida' })
  @ApiResponse({ status: 201, description: 'Medição registrada com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados da requisição são inválidos.',
  })
  @ApiResponse({ status: 409, description: 'Leitura já registrada.' })
  async readMeasure(@Body() body: CreateMeasureRequestDto) {
    return this.measureService.readMeasure(body);
  }

  @Patch('confirm')
  @ApiOperation({ summary: 'Confirmação de medida registrada' })
  @ApiResponse({ status: 200, description: 'Medição confirmada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Leitura não encontrada.' })
  @ApiResponse({ status: 409, description: 'Leitura já confirmada.' })
  async confirmMeasure(@Body() body: ConfirmMeasureDto) {
    return this.measureService.confirmMeasure(body);
  }

  @Get(':customer_code/list')
  @ApiOperation({ summary: 'Listar medidas de um cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de medições retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Nenhuma leitura encontrada.' })
  async listMeasures(
    @Param('customer_code') customer_code: string,
    @Query('measure_type') measure_type?: MeasureType,
  ) {
    return this.measureService.listMeasures(customer_code, measure_type);
  }
}
