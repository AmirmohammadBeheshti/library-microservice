import { Injectable } from '@nestjs/common';
import { AddGenreDto, FilterGenreDto } from './dto/request';
import { GenreRepository } from './genre.repository';

@Injectable()
export class GenreService {
  constructor(private readonly genreRepo: GenreRepository) {}
  async addGenre(addGenre: AddGenreDto) {
    return await this.genreRepo.create(addGenre);
  }
  async filterGenre(filterGenre: FilterGenreDto) {
    const { take, page, name } = filterGenre;
    const Pagination = { take, page };
    return await this.genreRepo.findAndPaginate(Pagination, {
      name: name && { $regex: name },
    });
  }
}
