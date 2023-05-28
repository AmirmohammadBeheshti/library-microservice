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
import { CurrentUser, JwtAuthGuard, IUserInfo } from '@app/common';
import { AddCartDto, BillCartDto, FilterCartDto } from './dto/request';
import { CartSerializer } from './cart.serializer';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartSerializer: CartSerializer,
  ) {}

  @Get()
  async findItems(
    @CurrentUser() user: IUserInfo,
    @Query() filterCart: FilterCartDto,
  ) {
    const items = await this.cartService.filterCart(user._id, filterCart);
    return this.cartSerializer.serializePaginated(items);
  }

  @Post('add-item')
  async addItemToCart(
    @Body() addCart: AddCartDto,
    @CurrentUser() user: IUserInfo,
  ) {
    return await this.cartService.addCart({
      userId: user?._id,
      bookId: addCart.bookId,
    });
  }
  @Delete('remove-item')
  async removeItem(
    @Body() addCart: AddCartDto,
    @CurrentUser() user: IUserInfo,
  ) {
    return await this.cartService.removeFromCart({
      userId: user?._id,
      bookId: addCart.bookId,
    });
  }
  @Post('bill')
  async billCart(
    @Body() billCart: BillCartDto,
    @CurrentUser() user: IUserInfo,
  ) {
    const bill = await this.cartService.billCart(user?._id, billCart.cartId);
    return this.cartSerializer.serialize(bill);
  }
}
