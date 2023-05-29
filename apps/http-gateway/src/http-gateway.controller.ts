import { Controller, Get } from '@nestjs/common';
import { HttpGatewayService } from './http-gateway.service';

@Controller()
export class HttpGatewayController {
  constructor(private readonly httpGatewayService: HttpGatewayService) {}
}
