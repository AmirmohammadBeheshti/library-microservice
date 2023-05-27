import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'cart', timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;
  @Prop([{ type: Object, required: true }])
  products: Record<string, any>[];
  @Prop({ type: Boolean, default: false })
  isPaid: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
