import { BaseMongooseRepository } from '@app/common/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IErrMsgRepository } from '@app/common/database/repository.type';
import { User } from './schema/user.schema';

@Injectable()
export class UserRepository extends BaseMongooseRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    const errMsg: IErrMsgRepository = {
      duplicateErr: 'این کاربر تکراری است',
      notFoundError: 'کاربر مورد نظر یافت نشد',
    };
    super(userModel, errMsg);
  }
}
