import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Author, GetAuthorsPaginatedResponse } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Schema as MongooSchema } from 'mongoose';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { JwtAuthGuard } from '../auth/jwt-auth.gards';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation(() => Author)
  @UseGuards(JwtAuthGuard)
  createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
  ) {
    return this.authorService.create(createAuthorInput);
  }

  @Query(() => GetAuthorsPaginatedResponse, { name: 'allAuthors' })
  findAll(@Args() args: GetPaginatedArgs) {
    const { limit, skip } = args;
    return this.authorService.findAll(limit, skip);
  }

  @Query(() => Author, { name: 'author' })
  findAuthorById(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.authorService.findAuthorById(id);
  }

  @Mutation(() => Author)
  @UseGuards(JwtAuthGuard)
  updateAuthor(
    @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput,
  ) {
    return this.authorService.updateAuthor(
      updateAuthorInput._id,
      updateAuthorInput,
    );
  }

  @Mutation(() => Author)
  @UseGuards(JwtAuthGuard)
  removeAuthor(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.authorService.remove(id);
  }
}
