import { UserLevel } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsStrongPassword,
  IsMobilePhone,
} from 'class-validator';

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
    default: UserLevel.NORMAL,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(UserLevel)
  level: UserLevel;
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
  @IsMobilePhone('fa-IR')
  mobile: string;
  @ApiProperty({
    default: 'password123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
