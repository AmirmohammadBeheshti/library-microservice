import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './users/dto/request';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CurrentUser } from '@app/common';
import { User } from './users/schema/user.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guard/jwt.guard';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser('id') user: User, @Body() login: LoginDto) {
    return await this.authService.login(user);
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data?.user;
  }
}
