import { BaseSerializer } from '@app/common';
import { Injectable } from '@nestjs/common';
import { GenreResponseDto } from './dto/response';
import { Pagination } from '@app/common/database/repository.type';
import { Genre } from './schema/genre.schema';

@Injectable()
//set type of input
export class GenreSerializer extends BaseSerializer<Genre, GenreResponseDto> {
  public async serialize(genre: Genre): Promise<GenreResponseDto> {
    return new GenreResponseDto(genre);
  }

  public async serializePaginated(
    value: Pagination<Genre>,
  ): Promise<Pagination<GenreResponseDto>> {
    const paginated: Pagination<GenreResponseDto> =
      new Pagination<GenreResponseDto>(
        value.items.map((genre) => new GenreResponseDto(genre)),
        value.meta,
      );

    return paginated;
  }
}
