import { Field, ArgsType, PartialType } from '@nestjs/graphql';
import { GetPaginatedArgs } from './get-paginated.args';
import { Schema as MongooSchema } from 'mongoose';

@ArgsType()
export class GetPaginatedSubDocumentsArgs extends PartialType(
  GetPaginatedArgs,
) {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;
}
