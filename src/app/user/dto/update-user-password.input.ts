import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsStrongPassword } from 'class-validator';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  @IsString()
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
