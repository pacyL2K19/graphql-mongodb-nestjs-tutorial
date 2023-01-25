import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class CreateBookInput {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  title: string;

  @Field(() => String)
  @IsString()
  @MinLength(10)
  @MaxLength(255)
  description: string;

  @Field(() => Float)
  @IsNumber({
    maxDecimalPlaces: 3,
    allowNaN: false,
  })
  price: number;

  @Field(() => String)
  @IsUrl()
  coverImage: string;

  @Field(() => String)
  @IsString()
  isbn: string;

  @Field(() => String)
  @IsMongoId()
  author: MongooSchema.Types.ObjectId;
}
