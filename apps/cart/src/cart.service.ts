import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BOOKS_SERVICE, FilterCartDto, IPaginationOptions } from '@app/common';
import { Types } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { error } from 'console';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    @Inject(BOOKS_SERVICE) private readonly client: ClientProxy,
  ) {}
  async filterCart(userId: string, filterCart: FilterCartDto) {
    const { take, page, isPaid } = filterCart;
    const pagination: IPaginationOptions = { take, page };
    return await this.cartRepo.findAndPaginate(pagination, { isPaid, userId });
  }
  async removeFromCart(info: { userId: string; bookId: string }) {
    const bookId = this.validateMongoId(info.bookId);
    const findItemOnCart = await this.cartRepo.findOne({
      'products.id': bookId,
      isPaid: false,
    });
    if (!findItemOnCart)
      throw new RpcException({
        statusCode: 400,
        message: 'این محصول در سبد خرید شما وجود ندارد',
      });
  }
  async addCart(info: { userId: string; bookId: string }) {
    const bookId = this.validateMongoId(info.bookId);
    let bookInfo;
    try {
      bookInfo = await lastValueFrom(this.client.send('book-info', bookId));
    } catch (e) {
      throw new RpcException({
        statusCode: 400,
        message: e,
      });
    }

    this.client.emit('increase-sale-amount', bookId);
    const findOpenCart = await this.cartRepo.findOne({
      userId: info.userId,
      isPaid: false,
    });
    if (findOpenCart) {
      if (
        findOpenCart.products.find((val) => val.id?.toString() === info.bookId)
      ) {
        throw new RpcException({
          statusCode: 400,
          message: 'این محصول در سبد خرید شما وجود دارد',
        });
      }
    } else {
      await this.cartRepo.create({
        userId: info.userId,
        products: [this.generateBookInfo(bookInfo)],
      });
    }

    return true;
  }

  private generateBookInfo(bookInfo: Record<string, any>) {
    return {
      id: bookInfo._id,
      name: bookInfo.name,
      title: bookInfo.title,
      genre: bookInfo.genre,
      publicationDate: bookInfo.publicationDate,
      description: bookInfo.description,
      price: bookInfo.price,
    };
  }
  async billCart(userId: string, cartId: string) {
    const cartInfo = await this.cartRepo.findOne({ id: cartId });

    if (cartInfo) {
      throw new RpcException({
        statusCode: 404,
        message: 'صورتحساب مورد نظر یافت نشد',
      });
    }
    if (cartInfo.userId !== userId) {
      throw new RpcException({
        statusCode: 400,
        message: 'این صورتحساب متعلق به شما نیست',
      });
    }
    if (cartInfo.isPaid) {
      throw new RpcException({
        statusCode: 400,
        message: 'این صورتحساب پرداخت شده است',
      });
    }
    return await this.cartRepo.findOneAndUpdate(
      { _id: cartId },
      { isPaid: true },
    );
  }
  private validateMongoId(value: string) {
    if (Types.ObjectId.isValid(value)) {
      if (String(new Types.ObjectId(value)) === value) return value;
      throw new RpcException({
        statusCode: 400,
        message: 'آیدی وارد شده درست نیست',
      });
    }
  }
}
