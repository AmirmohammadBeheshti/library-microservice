import {
  AddCartDto,
  BillCartDto,
  CART_SERVICE,
  CurrentUser,
  FilterCartDto,
  IUserInfo,
  JwtAuthGuard,
  RemoveCartDto,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(@Inject(CART_SERVICE) private readonly cartClient: ClientProxy) {}
  @Get()
  async findItems(
    @CurrentUser() user: IUserInfo,
    @Query() filterCart: FilterCartDto,
  ) {
    return await this.cartClient.send('find-items', { user, filterCart });
  }

  @Post('add-item')
  async addItemToCart(
    @Body() addCart: AddCartDto,
    @CurrentUser() user: IUserInfo,
  ) {
    return await this.cartClient.send('add-item', { addCart, user });
  }
  @Delete('remove-item')
  async removeItem(
    @Body() removeCart: RemoveCartDto,
    @CurrentUser() user: IUserInfo,
  ) {
    return await this.cartClient.send('remove-item', { removeCart, user });
  }
  @Post('bill')
  async billCart(
    @Body() billCart: BillCartDto,
    @CurrentUser() user: IUserInfo,
  ) {
    return await this.cartClient.send('bill', { billCart, user });
  }
}
