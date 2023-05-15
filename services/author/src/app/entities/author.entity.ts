import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
@Directive('@key(fields: "_id")')
export class Author {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field()
  @Prop()
  name: string;
}

@ObjectType()
export class GetAuthorsPaginatedResponse {
  @Field(() => [Author], { nullable: false, defaultValue: [] })
  authors: Author[];

  @Field(() => Int, { nullable: false, defaultValue: 0 })
  authorsCount: number;
}

export type AuthorDocument = Author & Document;
export const AuthorSchema = SchemaFactory.createForClass(Author);
