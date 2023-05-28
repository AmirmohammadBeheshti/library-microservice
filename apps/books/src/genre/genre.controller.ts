import { JwtAuthGuard } from '@app/common';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenreService } from './genre.service';
import { AddGenreDto, FilterGenreDto } from './dto/request';
import { GenreSerializer } from './genre.serializer';

@ApiTags('genre')
@Controller('genre')
export class GenreController {
  constructor(
    private readonly genreService: GenreService,
    private readonly genreSerializer: GenreSerializer,
  ) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async addGenre(@Body() addGenre: AddGenreDto) {
    const createGenre = await this.genreService.addGenre(addGenre);
    return this.genreSerializer.serialize(createGenre);
  }

  @Get()
  async AllGenre(@Query() filterGenre: FilterGenreDto) {
    const allGenre = await this.genreService.filterGenre(filterGenre);
    return this.genreSerializer.serializePaginated(allGenre);
  }
}
