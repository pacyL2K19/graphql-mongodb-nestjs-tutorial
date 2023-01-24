import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { LoginUserResponseR, User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Schema as MongooSchema } from 'mongoose';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.gards';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, {
    name: 'userById',
    description: 'This will be like getting the user profile by his id',
  })
  getUserById(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.userService.getUserById(id);
  }

  @Query(() => LoginUserResponseR, {
    description: 'This query will help authenticate users',
  })
  loginUser(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.userService.loginUser(loginUserInput);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: MongooSchema.Types.ObjectId) {
    return this.userService.remove(id);
  }
}
