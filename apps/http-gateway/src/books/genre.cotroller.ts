import {
  AddGenreDto,
  BOOKS_SERVICE,
  FilterGenreDto,
  JwtAuthGuard,
} from '@app/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Genre')
@Controller('genre')
export class GenreController {
  constructor(
    @Inject(BOOKS_SERVICE) private readonly bookClient: ClientProxy,
  ) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async addGenre(@Body() addGenre: AddGenreDto) {
    return await lastValueFrom(this.bookClient.send('add-genre', addGenre));
  }

  @Get()
  async AllGenre(@Query() filterGenre: FilterGenreDto) {
    return await lastValueFrom(this.bookClient.send('all-genre', filterGenre));
  }
}
