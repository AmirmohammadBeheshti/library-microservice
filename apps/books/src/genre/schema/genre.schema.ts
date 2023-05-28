import { UserLevel } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'genre', timestamps: true })
export class Genre extends Document {
  @Prop({ type: String, required: true, unique: true, dropDups: true })
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
