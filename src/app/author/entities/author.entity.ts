import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Book } from '../../book/entities/book.entity';

@ObjectType()
@Schema()
export class Author {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field()
  @Prop()
  name: string;

  @Field(() => [Book])
  @Prop({ type: [{ type: MongooSchema.Types.ObjectId, ref: 'Book' }] })
  books: Book[];
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
