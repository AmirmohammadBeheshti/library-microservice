import {
  AUTH_SERVICE,
  CurrentUser,
  LocalAuthGuard,
  LoginDto,
  RegisterDto,
} from '@app/common';
import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'apps/auth/src/users/schema/user.schema';
import { lastValueFrom } from 'rxjs';

@ApiTags('Authentication')
@Controller('Auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly auth: ClientProxy) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await lastValueFrom(this.auth.send('register', registerDto));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser('id') user: User, @Body() loginDto: LoginDto) {
    try {
      return await lastValueFrom(this.auth.send('login', { user, loginDto }));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
