import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    default: 'username',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiProperty({
    default: 'password123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
