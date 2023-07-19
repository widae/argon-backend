import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RefreshResult {
  @Field()
  accessToken: string;

  @Field(() => String, { nullable: true })
  refreshToken: string | null;
}
