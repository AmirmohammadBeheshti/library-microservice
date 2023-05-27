import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'user', timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true, unique: true })
  username: string;
  @Prop({ type: String, required: true, unique: true })
  mobile: string;
  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;
  @Prop({ type: String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
