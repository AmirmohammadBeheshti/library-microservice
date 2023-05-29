import {
  BOOKS_SERVICE,
  CreateBookDto,
  CurrentUser,
  FilterBookDto,
  JwtAuthGuard,
  UpdateBookDto,
  ValidateMongoId,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'apps/auth/src/users/schema/user.schema';
import { lastValueFrom } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    @Inject(BOOKS_SERVICE) private readonly booksClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBook(@Body() createBook: CreateBookDto) {
    return await lastValueFrom(
      this.booksClient.send('create-book', createBook),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateBook(
    @Body() updateBook: UpdateBookDto,
    @Param('id', ValidateMongoId) id: string,
  ) {
    return await lastValueFrom(
      this.booksClient.send('update-book', { updateBook, id }),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBook(@Param('id', ValidateMongoId) id: string) {
    return await lastValueFrom(this.booksClient.send('delete-book', id));
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async filterBooks(
    @Query() filterBook: FilterBookDto,
    @CurrentUser() user: User,
  ) {
    return await lastValueFrom(
      this.booksClient.send('filter-books', { filterBook, user }),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneBook(@Param('id', ValidateMongoId) id: string) {
    return lastValueFrom(this.booksClient.send('find-one-book', id));
  }
}
