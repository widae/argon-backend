import { IsNumberString, Max, Min } from 'class-validator';
import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class SubsWithSubscriberIdArgs {
  @IsNumberString()
  @Field({ description: `구독자 ID` })
  subscriberId: string;

  @Max(1000)
  @Min(1)
  @Field(() => Int, { description: `최대 개체 수` })
  take = 10;

  @Min(0)
  @Field(() => Int, { description: `스킵 개체 수` })
  skip = 0;
}
