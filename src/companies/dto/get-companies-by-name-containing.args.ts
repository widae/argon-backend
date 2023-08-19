import { Max, Min, MinLength } from 'class-validator';
import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class GetCompaniesByNameContainingArgs {
  @MinLength(1)
  @Field({ description: `회사명 (또는 그 일부)` })
  name: string;

  @Max(1000)
  @Min(1)
  @Field(() => Int, { description: `최대 개체 수` })
  take = 10;

  @Min(0)
  @Field(() => Int, { description: `스킵 개체 수` })
  skip = 0;
}
