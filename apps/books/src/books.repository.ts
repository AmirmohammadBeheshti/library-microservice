import { BaseMongooseRepository } from '@app/common/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IErrMsgRepository } from '@app/common/database/repository.type';

import { Books } from './schema/books.schema';

@Injectable()
export class BooksRepository extends BaseMongooseRepository<Books> {
  constructor(@InjectModel(Books.name) private booksModel: Model<Books>) {
    const errMsg: IErrMsgRepository = {
      duplicateErr: 'این کتاب تکراری است',
      notFoundError: 'کتاب مورد نظر یافت نشد',
    };
    super(booksModel, errMsg);
  }
}
