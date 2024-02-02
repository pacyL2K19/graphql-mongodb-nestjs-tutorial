import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class BuyBookInput {
  @Field()
  @IsMongoId()
  userId: string;

  @Field()
  @IsMongoId()
  bookId: string;
}
