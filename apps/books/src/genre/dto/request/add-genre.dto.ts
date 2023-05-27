import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddGenreDto {
  @ApiProperty({
    default: 'Drama',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
