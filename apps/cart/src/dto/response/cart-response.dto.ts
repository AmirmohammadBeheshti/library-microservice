import { Cart } from '../../schema/cart.schema';
import { ProductsDto } from './products.dto';

export class CartResponseDto {
  id: string;
  user: string;
  products: Record<string, any>[];
  isPaid: boolean;
  constructor(cart: Cart) {
    this.id = cart._id.toString();
    this.user = cart.userId.toString();
    this.products = cart.products.map((val) => new ProductsDto(val));
    this.isPaid = cart.isPaid;
  }
}
