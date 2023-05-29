import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@app/common';
import { User } from './schema/user.schema';
import { UserSerializer } from './user.serializer';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(
    private readonly userSerializer: UserSerializer,
    private readonly userService: UsersService,
  ) {}

  @MessagePattern('profile')
  async profile(user: User) {
    return this.userSerializer.serialize(user);
  }
  @MessagePattern('validateUser')
  async validateUser(@Payload() val: { password: string; username: string }) {
    console.log('val', val);
    return await this.userService.validateUser(val.password, val.username);
  }
}
