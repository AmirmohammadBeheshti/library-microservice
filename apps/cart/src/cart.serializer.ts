import { BaseSerializer, Pagination } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CartResponseDto } from './dto/response';
import { Cart } from './schema/cart.schema';

@Injectable()
//set type of input
export class CartSerializer extends BaseSerializer<Cart, CartResponseDto> {
  public async serialize(cart: Cart): Promise<CartResponseDto> {
    return new CartResponseDto(cart);
  }

  public async serializePaginated(
    value: Pagination<Cart>,
  ): Promise<Pagination<CartResponseDto>> {
    const paginated: Pagination<CartResponseDto> =
      new Pagination<CartResponseDto>(
        value.items.map((cart) => new CartResponseDto(cart)),
        value.meta,
      );

    return paginated;
  }
}
