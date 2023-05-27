import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, IUserInfo } from '@app/common';
import { AddCartDto } from './dto/request';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findItems() {}

  @Post('add-item')
  async getHello(@Body() addCart: AddCartDto, @CurrentUser() user: IUserInfo) {
    return await this.cartService.addCart({
      userId: user._id,
      bookId: addCart.bookId,
    });
  }
  @Delete('remove-item')
  removeItem() {}
}
