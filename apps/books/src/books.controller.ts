import {
  Body,
  Controller,
  Delete,
  Get,
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
import { BooksResponseDto } from './dto/response';
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly booksSerializer: BooksSerializer,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBook(@Body() createBook: CreateBookDto) {
    console.log('run');
    const create = await this.booksService.createBook(createBook);
    return this.booksSerializer.serialize(create);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateBook(
    @Body() updateBook: UpdateBookDto,
    @Param('id', ValidateMongoId) id: string,
  ) {
    const create = await this.booksService.updateBook(id, updateBook);
    return this.booksSerializer.serialize(create);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
}
