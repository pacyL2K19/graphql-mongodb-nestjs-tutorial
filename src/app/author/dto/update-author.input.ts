import { CreateAuthorInput } from './create-author.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { IsString } from 'class-validator';

@InputType()
export class UpdateAuthorInput extends PartialType(CreateAuthorInput) {
  @Field(() => String)
  @IsString()
  _id: MongooSchema.Types.ObjectId;
}
