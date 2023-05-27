import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    required: true,
  })
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(50)
  take: number;
  @ApiProperty({
    required: true,
  })
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page: number;
}

export class PaginationDtoOptional extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  take: number;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  page: number;
}
