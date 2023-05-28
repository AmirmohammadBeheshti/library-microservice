import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateBookDto, FilterBookDto, UpdateBookDto } from './dto/request';
import { BooksRepository } from './books.repository';
import { GenreService } from './genre/genre.service';
import { Genre } from './genre/schema/genre.schema';
import { Books } from './schema/books.schema';
import { GenreData } from './schema/genre-data.schema';
import { IPaginationOptions } from '@app/common/database/repository.interface';
import { RpcException } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { TOP_BOOK } from './constants';
import { Types } from 'mongoose';

@Injectable()
export class BooksService implements OnModuleInit {
  constructor(
    private readonly bookRepo: BooksRepository,
    private readonly genreService: GenreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    await this.findPopularBooks();
  }

  async createBook(createBook: CreateBookDto) {
    const genre = await this.validateGenre(createBook.genre);
    return await this.bookRepo.create({
      ...createBook,
      genre: this.fillGenreInfo(genre),
    });
  }

  async updateBook(bookId: string, updateBook: UpdateBookDto) {
    await this.findBookById(bookId);
    const genre =
      updateBook.genre && (await this.validateGenre(updateBook.genre));
    return await this.bookRepo.create({
      ...updateBook,
      genre: genre ? this.fillGenreInfo(genre) : undefined,
    });
  }

  public async filter(filterBooks: FilterBookDto) {
    const { take, page, author, genre, price, publicationDate, title } =
      filterBooks;
    const pagination: IPaginationOptions = { take, page };
    return await this.bookRepo.findAndPaginate(pagination, {
      title: title && { $regex: title },
      'genre.name': genre,
      price,
      publicationDate,
      author,
    });
  }

  private async findBookOnCache(bookId: string) {
    const findBook = await this.cacheManager.get(TOP_BOOK);
    const filter = findBook.filter((val) => val._id.toString() == bookId);
    if (filter.length) return filter[0];
  }
  public async findBookById(id: string): Promise<Books> {
    let findBook;
    findBook = await this.findBookOnCache(id);
    if (findBook) return findBook;
    findBook = findBook = await this.bookRepo.findOneOrFailed({
      _id: id,
      isDeleted: false,
    });
    return findBook;
  }

  public async findBook(id: string): Promise<Books> {
    let book;
    book = await this.findBookOnCache(id);
    if (book) return book;
    book = await this.bookRepo.findOne({ _id: id, isDeleted: false });
    if (!book) {
      throw new RpcException('کتاب مورد نظر یافت نشد');
    }
    return book;
  }
  public async deleteBook(bookId: string) {
    await this.findBookById(bookId);
    await this.findPopularBooks();
    return this.bookRepo.remove({ _id: bookId });
  }
  private fillGenreInfo(genre: Genre): GenreData {
    return {
      id: genre._id.toString(),
      name: genre.name,
    };
  }
  private async validateGenre(genreId: string): Promise<Genre> {
    const findGenre = await this.genreService.findGenreById(genreId);
    if (!findGenre) throw new NotFoundException('ژانر مورد نظر پیدا نشد');
    return findGenre;
  }

  async increaseSaleAmount(bookId: string) {
    const update = await this.bookRepo.updateOne(
      { _id: bookId },
      { $inc: { salesAmount: +1 } },
    );
    await this.findPopularBooks();

    return update;
  }
  async decreaseSaleAmount(bookId: string) {
    const update = await this.bookRepo.updateOne(
      { _id: bookId },
      { $inc: { salesAmount: -1 } },
    );
    await this.findPopularBooks();
    return update;
  }

  private async findPopularBooks() {
    const findTopBook = await this.bookRepo.find({}, null, {
      sort: { salesAmount: -1 },
      limit: 10,
    });
    await this.cacheManager.set(TOP_BOOK, findTopBook);
  }
}
