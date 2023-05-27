import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/request';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
}
