import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class LoginUserResponse {
  @Field(() => User)
  user: User;

  @Field()
  authToken: string;
}
