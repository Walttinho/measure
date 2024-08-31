// src/measure/dto/measure.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { MeasureType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeasureRequestDto {
  @ApiProperty({
    description: 'Código único do cliente',
    example: 'customer-code-1',
  })
  @IsString()
  customer_code: string;

  @ApiProperty({
    description: 'Data e hora da medição (ISO 8601)',
    example: '2023-05-01T12:00:00.000Z',
  })
  @IsDate()
  measure_datetime: Date;

  @ApiProperty({
    description: 'Tipo de medida (ex: WATER, GAS)',
    example: MeasureType.WATER,
  })
  @IsEnum(MeasureType)
  measure_type: MeasureType;

  @ApiProperty({
    description: 'Imagem da medição em formato base64',
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNby...',
  })
  @IsString()
  image: string;
}

export class CreateMeasureDto {
  @ApiProperty({
    description: 'UUID único da medida',
    example: 'a123e456-7e89-12d3-a456-426614174000',
  })
  @IsString()
  measure_uuid: string;

  @ApiProperty({
    description: 'URL da imagem associada à medida',
    example: 'https://example.com/image.png',
  })
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Valor numérico da medida',
    example: 100,
  })
  @IsNumber()
  measure_value: number;

  @ApiProperty({
    description: 'Tipo de medida (ex: WATER, GAS)',
    example: MeasureType.WATER,
  })
  @IsEnum(MeasureType)
  measure_type: MeasureType;

  @ApiProperty({
    description: 'Data e hora da medida (ISO 8601)',
    example: '2024-08-29T14:00:00Z',
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  measure_datetime: Date;

  @ApiProperty({
    description: 'ID do cliente associado',
    example: 'b123e456-7e89-12d3-a456-426614174001',
  })
  @IsString()
  customer_id: string;

  @ApiProperty({
    description: 'Indica se a medida foi confirmada',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  has_confirmed?: boolean;
}

export class UpdateMeasureDto {
  @ApiProperty({
    description: 'URL da imagem associada à medida',
    example: 'https://example.com/image-updated.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Valor atualizado da medida',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  measure_value?: number;

  @ApiProperty({
    description: 'Tipo de medida (ex: WATER, GAS)',
    example: MeasureType.GAS,
    required: false,
  })
  @IsOptional()
  @IsEnum(MeasureType)
  measure_type?: MeasureType;

  @ApiProperty({
    description: 'Data e hora atualizada da medida (ISO 8601)',
    example: '2024-08-30T14:00:00Z',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  measure_datetime?: Date;

  @ApiProperty({
    description: 'Indica se a medida foi confirmada',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  has_confirmed?: boolean;
}

export class ConfirmMeasureDto {
  @ApiProperty({
    description: 'UUID único da medida a ser confirmada',
    example: 'a123e456-7e89-12d3-a456-426614174000',
  })
  @IsString()
  measure_uuid: string;

  @ApiProperty({
    description: 'Valor confirmado da medida',
    example: 100,
  })
  @IsNumber()
  confirmed_value: number;
}
