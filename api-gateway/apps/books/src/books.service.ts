import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
  getHello(): string {
    return 'Hello World!';
  }
}
