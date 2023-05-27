import { Controller, Get, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common';
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // getHello(): string {
  //   return this.booksService.getHello();
  // }
}
