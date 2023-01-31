import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class BuyBookInput {
  @Field()
  @IsMongoId()
  userId: MongooSchema.Types.ObjectId;

  @Field()
  @IsMongoId()
  bookId: MongooSchema.Types.ObjectId;
}
