import { UseGuards } from '@nestjs/common';
import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserResponse } from './dto/login-response';
import { GqlAuthGuard } from './gql-auth.gards';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginUserResponse)
  @UseGuards(GqlAuthGuard)
  login(@Context() context) {
    return this.authService.login(context);
  }
}
