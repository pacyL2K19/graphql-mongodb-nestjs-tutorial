import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { Book } from './book.entity';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "_id")')
export class Author {
  @Field(() => String)
  @Directive('@external')
  _id: MongooSchema.Types.ObjectId;

  @Field(() => [Book])
  @Prop({ type: [{ type: MongooSchema.Types.ObjectId, ref: 'Book' }] })
  books: Book[];
}
