import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/request';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@app/common';
import { User } from './schema/user.schema';
import { UserSerializer } from './user.serializer';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userSerializer: UserSerializer) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async profile(@CurrentUser() user: User) {
    return this.userSerializer.serialize(user);
  }
}
