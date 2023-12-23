import { InputType, Field } from '@nestjs/graphql';

@InputType({ description: `구글 로그인 관련 입력` })
export class LogInWithGoogleInput {
  @Field({ description: `구글 인가 코드` })
  code: string;
}
