import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: `리프레시 결과` })
export class RefreshResult {
  @Field({ description: `엑세스 토큰` })
  accessToken: string;

  @Field(() => String, { nullable: true, description: `리프레시 토큰` })
  refreshToken: string | null;
}
