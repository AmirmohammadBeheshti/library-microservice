import { PaginationDto } from '@app/common';
import { Pagination } from '@app/common/database/repository.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class FilterGenreDto extends PaginationDto {
  @ApiProperty({
    default: 'Drama',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;
}
