import {
  CurrentUser,
  LocalAuthGuard,
  LoginDto,
  RegisterDto,
} from '@app/common';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'apps/auth/src/users/schema/user.schema';
import { lastValueFrom } from 'rxjs';

@Controller('Auth')
export class AuthController {
  constructor(private readonly auth: ClientProxy) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await lastValueFrom(this.auth.send('register', registerDto));
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser('id') user: User) {
    return await lastValueFrom(this.auth.send('login', registerDto));
  }
}
