import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_SERVICE } from '../constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClientProxy: ClientProxy,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await lastValueFrom(
      this.authClientProxy.send('validateUser', {
        password,
        username,
      }),
    );
    console.log('asdsa', { username, password });

    if (!user) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid username or password!',
      });
    }
    return user;
  }
}
