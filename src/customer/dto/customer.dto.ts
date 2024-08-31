import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Código único do cliente',
    example: 'customer123',
  })
  @IsString()
  customer_code: string;
}
