import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly bookservice: BookService) {}

  @ResolveField(() => [Book])
  public books(@Parent() author: Author) {
    return this.bookservice.getBooksByAuthorId(author._id);
  }
}
