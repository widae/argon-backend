import { Max, Min, MinLength } from 'class-validator';
import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class GetCompaniesByNameContainingArgs {
  @MinLength(1)
  @Field()
  name: string;

  @Max(1000)
  @Min(1)
  @Field(() => Int)
  take = 10;

  @Min(0)
  @Field(() => Int)
  skip = 0;
}
