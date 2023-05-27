import { Cart } from '../../schema/cart.schema';

export class CartResponseDto {
  user: string;
  products: Record<string, any>[];
  isPaid: boolean;
  constructor(cart: Cart) {
    this.user = cart.userId.toString();
    this.products = cart.products;
    this.isPaid = cart.isPaid;
  }
}
