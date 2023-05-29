import { AddGenreDto, FilterGenreDto, JwtAuthGuard } from '@app/common';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenreService } from './genre.service';
import { GenreSerializer } from './genre.serializer';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('genre')
export class GenreController {
  constructor(
    private readonly genreService: GenreService,
    private readonly genreSerializer: GenreSerializer,
  ) {}

  @MessagePattern('add-genre')
  async addGenre(@Payload() addGenre: AddGenreDto) {
    const createGenre = await this.genreService.addGenre(addGenre);
    return this.genreSerializer.serialize(createGenre);
  }

  @MessagePattern('all-genre')
  async AllGenre(@Payload() filterGenre: FilterGenreDto) {
    const allGenre = await this.genreService.filterGenre(filterGenre);
    return this.genreSerializer.serializePaginated(allGenre);
  }
}
