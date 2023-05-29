import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
