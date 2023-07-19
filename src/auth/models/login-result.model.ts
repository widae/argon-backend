import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResult {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
