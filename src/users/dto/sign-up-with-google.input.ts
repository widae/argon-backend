import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize } from 'class-validator';

@InputType({ description: `구글로 회원 가입하기 위한 입력` })
export class SignUpWithGoogleInput {
  @Field({ description: `구글 인가 코드` })
  code: string;

  @Field({ description: `사용자 닉네임` })
  nickname: string;

  @ArrayMinSize(1)
  @Field(() => [String], { description: `동의하는 정책 ID 리스트` })
  policyIds: string[];
}
