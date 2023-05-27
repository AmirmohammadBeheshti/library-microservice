import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../constants';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClientProxy: ClientProxy,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().headers?.authorization;

    if (!jwt) return false;
    return this.authClientProxy
      .send('authenticate', {
        Authorization: jwt.replace(/bearer/gi, '').trim(),
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        catchError((err) => throwError(new UnauthorizedException())),
      );
  }
}
