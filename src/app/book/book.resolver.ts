import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book, GetBooksPaginatedResponse } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { GetPaginatedSubDocumentsArgs } from '../common/dto/get-paginated-sub-document.args';
import { Schema as MongooSchema } from 'mongoose';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Mutation(() => Book)
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
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.updateBook(updateBookInput._id, updateBookInput);
  }

  @Mutation(() => Book)
  removeBook(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.bookService.removeBook(id);
  }
}
