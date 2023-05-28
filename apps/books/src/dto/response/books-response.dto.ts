import { Books } from '../../schema/books.schema';

export class BooksResponseDto {
  id: string;
  title: string;
  author: string;
  genre: any;
  publicationDate: Date;
  price: number;
  isPremium: boolean;
  description: string;
  constructor(books: Books) {
    this.id = books._id.toString();
    this.title = books.title;
    this.author = books.author;
    this.isPremium = books.isPremium;
    this.genre = books.genre;
    this.publicationDate = books.publicationDate;
    this.price = books.price;
    this.description = books.description;
  }
}
