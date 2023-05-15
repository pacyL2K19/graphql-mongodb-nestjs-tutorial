import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getHello(): string {
    return this.booksService.getHello();
  }
}
