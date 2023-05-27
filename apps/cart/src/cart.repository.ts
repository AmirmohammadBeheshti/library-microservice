import { BaseMongooseRepository } from '@app/common/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IErrMsgRepository } from '@app/common/database/repository.type';
import { Cart } from './schema/cart.schema';

@Injectable()
export class CartRepository extends BaseMongooseRepository<Cart> {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {
    const errMsg: IErrMsgRepository = {
      duplicateErr: 'این کتاب تکراری است',
      notFoundError: 'کتاب مورد نظر یافت نشد',
    };
    super(cartModel, errMsg);
  }
}
