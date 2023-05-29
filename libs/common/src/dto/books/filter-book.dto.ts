import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import * as dayjs from 'dayjs';
import { PaginationDtoOptional } from '../pagination.dto';
import { IsOnlyDate } from '@app/common/decorators';

export class FilterBookDto extends PaginationDtoOptional {
  @ApiProperty({
    default: 'book title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;
  @ApiProperty({
    default: 'sadegh hedyat ',
    required: false,
  })
  @IsOptional()
  @IsString()
  author: string;
  @ApiProperty({
    default: 'sadegh hedyat ',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre: string;
  @ApiProperty({
    default: new Date(),
    required: false,
  })
  @IsOptional()
  @IsOnlyDate()
  @Transform((val) => dayjs(val.value).format('YYYY-MM-DD'))
  publicationDate: string;
  @ApiProperty({
    default: 205425,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price: number;
}
