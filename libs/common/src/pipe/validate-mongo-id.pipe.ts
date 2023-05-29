import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    // Optional casting into ObjectId if wanted!
    if (Types.ObjectId.isValid(value)) {
      if (String(new Types.ObjectId(value)) === value) return value;
      throw new RpcException({
        statusCode: 400,
        message: 'آیدی وارد شده درست نیست',
      });
    }
    throw new RpcException({
      statusCode: 400,
      message: 'آیدی وارد شده درست نیست',
    });
  }
}
