import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    // Optional casting into ObjectId if wanted!
    if (Types.ObjectId.isValid(value)) {
      if (String(new Types.ObjectId(value)) === value) return value;
      throw new BadRequestException('آیدی وارد شده درست نیست');
    }
    throw new BadRequestException('آیدی وارد شده درست نیست');
  }
}
