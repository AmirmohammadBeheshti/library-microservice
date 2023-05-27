import { UserLevel } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'books', timestamps: true })
export class Books extends Document {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  author: string;
  @Prop({ type: String, required: true })
  genre: string;
}

export const BooksSchema = SchemaFactory.createForClass(Books);
