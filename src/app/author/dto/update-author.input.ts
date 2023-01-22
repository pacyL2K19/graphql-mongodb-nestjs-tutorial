import { CreateAuthorInput } from './create-author.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class UpdateAuthorInput extends PartialType(CreateAuthorInput) {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;
}
