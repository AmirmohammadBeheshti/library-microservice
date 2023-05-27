import { UserLevel } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'user', timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true, unique: true, dropDups: true })
  mobile: string;
  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;
  @Prop({ type: String, required: true, unique: true, dropDups: true })
  username: string;
  @Prop({ type: String, enum: UserLevel, default: UserLevel.NORMAL })
  level: UserLevel;
  @Prop({ type: String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
