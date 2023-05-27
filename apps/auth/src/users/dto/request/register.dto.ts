import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    default: 'first name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @ApiProperty({
    default: 'last name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @ApiProperty({
    default: 'username',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiProperty({
    default: '9152622703',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  mobile: string;
  @ApiProperty({
    default: 'password123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
