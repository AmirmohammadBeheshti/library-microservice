import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  IUserInfo,
  FilterCartDto,
  AddCartDto,
  BillCartDto,
  RemoveCartDto,
} from '@app/common';
import { CartSerializer } from './cart.serializer';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartSerializer: CartSerializer,
  ) {}

  @MessagePattern('find-items')
  async findItems(
    @Payload() info: { filterCart: FilterCartDto; user: IUserInfo },
  ) {
    const items = await this.cartService.filterCart(
      info.user._id,
      info.filterCart,
    );
    return this.cartSerializer.serializePaginated(items);
  }

  @MessagePattern('add-item')
  async addItemToCart(
    @Payload() info: { addCart: AddCartDto; user: IUserInfo },
  ) {
    return await this.cartService.addCart({
      userId: info.user?._id,
      bookId: info.addCart.bookId,
    });
  }
  @MessagePattern('remove-item')
  async removeItem(
    @Payload() info: { removeCart: RemoveCartDto; user: IUserInfo },
  ) {
    return await this.cartService.removeFromCart({
      userId: info.user?._id,
      bookId: info.removeCart.bookId,
    });
  }
  @MessagePattern('bill')
  async billCart(@Payload() info: { billCart: BillCartDto; user: IUserInfo }) {
    const bill = await this.cartService.billCart(
      info.user?._id,
      info.billCart.cartId,
    );
    return this.cartSerializer.serialize(bill);
  }
}
