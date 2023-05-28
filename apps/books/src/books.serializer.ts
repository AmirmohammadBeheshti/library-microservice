import { BaseSerializer } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Pagination } from '@app/common/database/repository.type';
import { Books } from './schema/books.schema';
import { BooksResponseDto } from './dto/response';

@Injectable()
//set type of input
export class BooksSerializer extends BaseSerializer<Books, BooksResponseDto> {
  public async serialize(book: Books): Promise<BooksResponseDto> {
    return new BooksResponseDto(book);
  }

  public async serializePaginated(
    value: Pagination<Books>,
  ): Promise<Pagination<BooksResponseDto>> {
    const paginated: Pagination<BooksResponseDto> =
      new Pagination<BooksResponseDto>(
        value.items.map((book) => new BooksResponseDto(book)),
        value.meta,
      );

    return paginated;
  }
}
