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
import {
  CreateBookDto,
  CurrentUser,
  FilterBookDto,
  JwtAuthGuard,
  UpdateBookDto,
  ValidateMongoId,
} from '@app/common';
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
  @MessagePattern('create-book')
  async createBook(@Payload() createBook: CreateBookDto) {
    const create = await this.booksService.createBook(createBook);
    return this.booksSerializer.serialize(create);
  }
  @MessagePattern('update-book')
  async updateBook(@Payload() updateVal: { UpdateBookDto; id: string }) {
    const update = await this.booksService.updateBook(
      updateVal.id,
      updateVal.UpdateBookDto.updateBook,
    );
    return this.booksSerializer.serialize(update);
  }
  @MessagePattern('delete-book')
  async deleteBook(@Payload() id: string) {
    return await this.booksService.deleteBook(id);
  }
  @MessagePattern('filter-books')
  async filterBooks(
    @Payload() val: { filterBook: FilterBookDto; user: User },
    @CurrentUser() user: User,
  ) {
    const filter = await this.booksService.filter(
      val.filterBook,
      val.user.level,
    );
    return this.booksSerializer.serializePaginated(filter);
  }
  @MessagePattern('find-one-book')
  async findOneBook(@Payload() id: string) {
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
