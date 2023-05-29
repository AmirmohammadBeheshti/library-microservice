import { AUTH_SERVICE, CurrentUser, JwtAuthGuard } from '@app/common';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'apps/auth/src/users/schema/user.schema';
import { lastValueFrom } from 'rxjs';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(@Inject(AUTH_SERVICE) private readonly clientUser: ClientProxy) {}
  @Get()
  async findProfile(@CurrentUser() user: User) {
    return await lastValueFrom(this.clientUser.send('profile', user));
  }
}
