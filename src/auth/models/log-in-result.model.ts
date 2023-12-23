import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: `로그인 결과` })
export class LogInResult {
  @Field({ description: `엑세스 토큰` })
  accessToken: string;

  @Field({ description: `리프레시 토큰` })
  refreshToken: string;
}
