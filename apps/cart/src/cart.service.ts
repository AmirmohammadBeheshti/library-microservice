import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKS_SERVICE, IPaginationOptions } from '@app/common';
import { Types } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { error } from 'console';
import { FilterCartDto } from './dto/request';

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
      throw new BadRequestException('این محصول در سبد خرید شما وجود ندارد');

    await this.cartRepo.updateOne(
      {
        _id: findItemOnCart._id,
      },
      {
        $pull: { products: { id: info.bookId } },
      },
    );
    this.client.emit('decrease-sale-amount', bookId);
    return true;
  }
  async addCart(info: { userId: string; bookId: string }) {
    const bookId = this.validateMongoId(info.bookId);
    let bookInfo;
    try {
      bookInfo = await lastValueFrom(this.client.send('book-info', bookId));
      console.log(bookInfo);
    } catch (e) {
      throw new NotFoundException(e);
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
        throw new BadRequestException('این محصول در سبد خرید شما وجود دارد');
      }
      this.cartRepo.updateOne(
        { _id: findOpenCart._id },
        {
          $push: {
            products: this.generateBookInfo(bookInfo),
          },
        },
      );
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
      throw new NotFoundException('صورتحساب مورد نظر یافت نشد');
    }
    if (cartInfo.userId !== userId) {
      throw new BadRequestException('این صورتحساب متعلق به شما نیست');
    }
    if (cartInfo.isPaid) {
      throw new BadRequestException('این صورتحساب پرداخت شده است');
    }
    return await this.cartRepo.findOneAndUpdate(
      { _id: cartId },
      { isPaid: true },
    );
  }
  private validateMongoId(value: string) {
    if (Types.ObjectId.isValid(value)) {
      if (String(new Types.ObjectId(value)) === value) return value;
      throw new BadRequestException('آیدی وارد شده درست نیست');
    }
  }
}
