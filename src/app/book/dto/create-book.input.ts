import { InputType, Field, Float } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class CreateBookInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  coverImage: string;

  @Field(() => String)
  isbn: string;

  @Field(() => String)
  author: MongooSchema.Types.ObjectId;
}
