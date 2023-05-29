import { Injectable } from '@nestjs/common';
import { GenreRepository } from './genre.repository';
import { AddGenreDto, FilterGenreDto } from '@app/common';

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

  async findGenreById(id: string) {
    return this.genreRepo.findOne({ _id: id });
  }
}
