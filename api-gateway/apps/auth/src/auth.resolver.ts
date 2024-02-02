import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { CreateUserInput } from 'apps/users/src/dto/create-user.input';
// import { User } from 'apps/users/src/entities/user.entity';

import { AuthService } from './auth.service';
import { LoginUserResponse } from './dto/login.response';
import { LoginUserInput } from './dto/login-user.input';
import { GqlAuthGuard } from './gql-auth.guards';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginUserResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context: any,
  ) {
    return this.authService.login(context.user);
  }

  // @Mutation(() => User)
  // signup(@Args('signupInput') signupInput: CreateUserInput) {
  //   return this.authService.signup(signupInput);
  // }
}
