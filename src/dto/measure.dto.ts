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

export class CreateMeasureDto {
  @ApiProperty({
    description: 'UUID da medida',
    example: 'a123e456-7e89-12d3-a456-426614174000',
  })
  @IsString()
  measure_uuid: string;

  @ApiProperty({
    description: 'URL da imagem associada à medida',
    example: 'https://example.com/image.png',
  })
  @IsString()
  image_url: string;

  @ApiProperty({
    description: 'Valor da medida',
    example: 100,
  })
  @IsNumber()
  measure_value: number;

  @ApiProperty({
    description: 'Tipo de medida',
    example: MeasureType.WATER,
  })
  @IsEnum(MeasureType)
  measure_type: MeasureType;

  @ApiProperty({
    description: 'Data e hora da medida',
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
  customerId: string;

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
  image_url?: string;

  @ApiProperty({
    description: 'Valor da medida',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  measure_value?: number;

  @ApiProperty({
    description: 'Tipo de medida',
    example: MeasureType.GAS,
    required: false,
  })
  @IsOptional()
  @IsEnum(MeasureType)
  measure_type?: MeasureType;

  @ApiProperty({
    description: 'Data e hora da medida',
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
