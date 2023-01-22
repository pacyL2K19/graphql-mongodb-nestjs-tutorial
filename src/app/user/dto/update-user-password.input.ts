import { InputType, Field } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  password: string;
}
