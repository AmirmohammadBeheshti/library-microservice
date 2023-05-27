import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './users/dto/request';
import { JwtService } from '@nestjs/jwt';
import { User } from './users/schema/user.schema';
import { UsersService } from './users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async login(user: User) {
    const tokenPayload: { userId: string } = {
      userId: user.id.toString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const token = this.jwtService.sign(tokenPayload);
    return { token };
  }
  async register(user: RegisterDto) {
    return await this.userService.addUser(user);
  }
}
