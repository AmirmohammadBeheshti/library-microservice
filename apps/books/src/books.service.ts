import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto, FilterBookDto, UpdateBookDto } from './dto/request';
import { BooksRepository } from './books.repository';
import { GenreService } from './genre/genre.service';
import { Genre } from './genre/schema/genre.schema';
import { Books } from './schema/books.schema';
import { GenreData } from './schema/genre-data.schema';
import { IPaginationOptions } from '@app/common/database/repository.interface';

@Injectable()
export class BooksService {
  constructor(
    private readonly bookRepo: BooksRepository,
    private readonly genreService: GenreService,
  ) {}
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
  public async findBookById(id: string): Promise<Books> {
    return await this.bookRepo.findOneOrFailed({ _id: id, isDeleted: false });
  }

  public async deleteBook(bookId: string) {
    await this.findBookById(bookId);
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
    return await this.bookRepo.updateOne(
      { _id: bookId },
      { $inc: { salesAmount: +1 } },
    );
  }
  async decreaseSaleAmount(bookId: string) {
    return await this.bookRepo.updateOne(
      { _id: bookId },
      { $inc: { salesAmount: -1 } },
    );
  }
}
