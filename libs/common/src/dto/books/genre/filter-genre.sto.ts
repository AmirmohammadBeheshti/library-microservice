import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { PaginationDtoOptional } from '../../pagination.dto';

export class FilterGenreDto extends PaginationDtoOptional {
  @ApiProperty({
    default: 'Drama',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;
}
