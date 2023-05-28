import { Prop } from '@nestjs/mongoose';

export class GenreData {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  name: string;
}
