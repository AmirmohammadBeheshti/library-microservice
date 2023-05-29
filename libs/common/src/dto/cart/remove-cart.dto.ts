import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class RemoveCartDto {
  @ApiProperty({
    default: '6471ed08dc4e1eea626d44a8',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  bookId: string;
}
