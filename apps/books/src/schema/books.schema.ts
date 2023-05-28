import { UserLevel } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Genre } from '../genre/schema/genre.schema';
import { GenreData } from './genre-data.schema';

@Schema({ collection: 'books', timestamps: true })
export class Books extends Document {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  author: string;
  @Prop({ type: GenreData, required: true })
  genre: GenreData;
  @Prop({ type: Date, required: true })
  publicationDate: Date;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: Number, default: 0 })
  salesAmount: number;
  @Prop({ type: String })
  description?: string;
  @Prop({ type: Boolean, default: false })
  isPremium: boolean;
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const BooksSchema = SchemaFactory.createForClass(Books);
