import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UserService: UsersService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.UserService.validateUser(password, username);
    if (!user) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid username or password!',
      });
    }
    return user;
  }
}
