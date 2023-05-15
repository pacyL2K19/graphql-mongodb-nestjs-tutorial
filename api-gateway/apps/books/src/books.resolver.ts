import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book, GetBooksPaginatedResponse } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import {
  GetPaginatedArgs,
  GetPaginatedSubDocumentsArgs,
} from '@app/common/dto';
import { Schema as MongooSchema } from 'mongoose';
import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { BuyBookInput } from './dto/buy-book.input';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly bookService: BooksService) {}

  // Only connected users with valid jwt tokens must create a book(Authentication)
  @Mutation(() => Book)
  // @UseGuards(JwtAuthGuard)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.bookService.createBook(createBookInput);
  }

  @Query(() => GetBooksPaginatedResponse, { name: 'books' })
  findAllBooks(@Args() args: GetPaginatedArgs) {
    return this.bookService.findAllBooks(args.limit, args.skip);
  }

  @Query(() => Book, { name: 'book' })
  findOne(@Args() args: GetPaginatedSubDocumentsArgs) {
    const { limit, skip, _id } = args;
    return this.bookService.getBookById(_id, skip, limit);
  }

  @Mutation(() => Book)
  // @UseGuards(JwtAuthGuard)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.updateBook(updateBookInput._id, updateBookInput);
  }

  // @Mutation(() => Book)
  // // @UseGuards(JwtAuthGuard)
  // removeBook(
  //   @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
  // ) {
  //   return this.bookService.removeBook(id);
  // }

  @Mutation(() => Book)
  // @UseGuards(JwtAuthGuard)
  buyBook(@Args('buyBookInput') buyBookInput: BuyBookInput) {
    return this.bookService.buyBook(buyBookInput);
  }
}
