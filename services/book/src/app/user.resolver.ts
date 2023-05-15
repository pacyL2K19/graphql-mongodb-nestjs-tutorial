import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly bookservice: BookService) {}

  @ResolveField(() => [Book])
  public books(@Parent() reader: User) {
    return this.bookservice.getBooksByReaderId(reader._id);
  }
}
