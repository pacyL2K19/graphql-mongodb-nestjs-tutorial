import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class UpdatePasswordInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  password: string;
}
