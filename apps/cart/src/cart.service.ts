import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  async addCart(info: { userId: string; bookId: string }) {
    console.log(info);
    return 'Hello World!';
  }
}
