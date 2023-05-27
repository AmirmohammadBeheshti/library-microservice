import { BaseMongooseRepository } from '@app/common/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IErrMsgRepository } from '@app/common/database/repository.type';
import { Genre } from './schema/genre.schema';

@Injectable()
export class GenreRepository extends BaseMongooseRepository<Genre> {
  constructor(@InjectModel(Genre.name) private genreModel: Model<Genre>) {
    const errMsg: IErrMsgRepository = {
      duplicateErr: 'این ژانر تکراری است',
      notFoundError: 'ژانر مورد نظر یافت نشد',
    };
    super(genreModel, errMsg);
  }
}
