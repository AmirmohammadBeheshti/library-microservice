export class ProductsDto {
  id: string;
  name: string;
  title: string;
  genre: Record<string, any>;
  publicationDate: Date;
  description: string;
  price: number;
  constructor(product: Record<string, any>) {
    this.id = product.id;
    this.name = product.name;
    this.title = product.title;
    this.genre = product.genre;
    this.publicationDate = product.publicationDate;
    this.description = product.description;
    this.price = product.price;
  }
}
