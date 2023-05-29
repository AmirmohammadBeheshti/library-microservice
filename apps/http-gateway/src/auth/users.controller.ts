import { CurrentUser, JwtAuthGuard } from '@app/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'apps/auth/src/users/schema/user.schema';
import { lastValueFrom } from 'rxjs';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: ClientProxy) {}
  @Get()
  findProfile(@CurrentUser() user: User) {
    return lastValueFrom(this.users.send('profile', user));
  }
}
