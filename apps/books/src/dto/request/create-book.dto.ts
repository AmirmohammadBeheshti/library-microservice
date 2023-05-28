import { IsOnlyDate } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

export class CreateBookDto {
  @ApiProperty({
    default: 'book title',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty({
    default: 'sadegh hedyat ',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  author: string;
  @ApiProperty({
    default: 'sadegh hedyat ',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  genre: string;
  @ApiProperty({
    default: new Date(),
    required: true,
  })
  @IsNotEmpty()
  @IsOnlyDate()
  @Transform((val) => dayjs(val.value).format('YYYY-MM-DD'))
  publicationDate: string;
  @ApiProperty({
    default: 205425,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  price: string;
  @ApiProperty({
    default: false,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isPremium: boolean;
  @ApiProperty({
    default: 'Description about book ',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
