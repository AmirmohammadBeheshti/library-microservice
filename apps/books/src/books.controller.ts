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
import { JwtAuthGuard, ValidateMongoId } from '@app/common';
import { CreateBookDto, FilterBookDto, UpdateBookDto } from './dto/request';
import { BooksSerializer } from './books.serializer';
import { Cache } from 'cache-manager';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly booksSerializer: BooksSerializer,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async createBook(@Body() createBook: CreateBookDto) {
    console.log('run');
    const create = await this.booksService.createBook(createBook);
    return this.booksSerializer.serialize(create);
  }

  @Put(':id')
  async updateBook(
    @Body() updateBook: UpdateBookDto,
    @Param('id', ValidateMongoId) id: string,
  ) {
    const create = await this.booksService.updateBook(id, updateBook);
    return this.booksSerializer.serialize(create);
  }

  @Delete(':id')
  async deleteBook(@Param('id', ValidateMongoId) id: string) {
    return await this.booksService.deleteBook(id);
  }

  @Get()
  async filterBooks(@Query() filterBook: FilterBookDto) {
    const filter = await this.booksService.filter(filterBook);
    return this.booksSerializer.serializePaginated(filter);
  }

  @Get(':id')
  async findOneBook(@Param('id', ValidateMongoId) id: string) {
    const findOne = await this.booksService.findBookById(id);
    return this.booksSerializer.serialize(findOne);
  }

  @MessagePattern('increase-sale-amount')
  async increaseSaleAmount(@Payload() bookId: string) {
    return await this.booksService.increaseSaleAmount(bookId);
  }

  @MessagePattern('decrease-sale-amount')
  async decreaseSaleAmount(@Payload() bookId: string) {
    return await this.booksService.decreaseSaleAmount(bookId);
  }
}
