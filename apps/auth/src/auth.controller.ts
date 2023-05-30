import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guard/jwt.guard';
import { User } from './users/schema/user.schema';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @MessagePattern('login')
  async login(@Payload() info: { user: User; loginDto: LoginDto }) {
    return await this.authService.login(info.user);
  }
  @MessagePattern('register')
  async register(@Payload() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data?.user;
  }
}
