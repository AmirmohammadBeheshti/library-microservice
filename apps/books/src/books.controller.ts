import {
  Body,
  CACHE_MANAGER,
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
import { BooksService } from './books.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, ValidateMongoId } from '@app/common';
import { CreateBookDto, FilterBookDto, UpdateBookDto } from './dto/request';
import { BooksSerializer } from './books.serializer';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { User } from 'apps/auth/src/users/schema/user.schema';

@ApiBearerAuth()
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly booksSerializer: BooksSerializer,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBook(@Body() createBook: CreateBookDto) {
    console.log('run');
    const create = await this.booksService.createBook(createBook);
    return this.booksSerializer.serialize(create);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateBook(
    @Body() updateBook: UpdateBookDto,
    @Param('id', ValidateMongoId) id: string,
  ) {
    const update = await this.booksService.updateBook(id, updateBook);
    return this.booksSerializer.serialize(update);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBook(@Param('id', ValidateMongoId) id: string) {
    return await this.booksService.deleteBook(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async filterBooks(
    @Query() filterBook: FilterBookDto,
    @CurrentUser() user: User,
  ) {
    const filter = await this.booksService.filter(filterBook, user.level);
    return this.booksSerializer.serializePaginated(filter);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneBook(@Param('id', ValidateMongoId) id: string) {
    const findOne = await this.booksService.findBookById(id);
    return this.booksSerializer.serialize(findOne);
  }

  @EventPattern('increase-sale-amount')
  async increaseSaleAmount(@Payload() bookId: string) {
    return await this.booksService.increaseSaleAmount(bookId);
  }

  @EventPattern('decrease-sale-amount')
  async decreaseSaleAmount(@Payload() bookId: string) {
    return await this.booksService.decreaseSaleAmount(bookId);
  }
  @MessagePattern('book-info')
  async bookInfo(@Payload() bookId: string) {
    return await this.booksService.findBook(bookId);
  }
}
