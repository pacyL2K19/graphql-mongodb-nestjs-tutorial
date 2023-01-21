import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
