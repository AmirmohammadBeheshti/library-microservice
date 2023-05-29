import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          const jwt =
            request?.headers?.Authentication ||
            request?.headers?.authorization ||
            request?.Authorization;
          return jwt && jwt.replace(/bearer/gi, '').trim();
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getOneById(payload.id);
    console.log('user', user);
    if (!user) {
      throw new RpcException({ statusCode: 401 });
    }
    return user;
  }
}
