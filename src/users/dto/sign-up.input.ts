import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize, IsEmail, IsNumberString } from 'class-validator';

@InputType({ description: `회원가입 관련 입력` })
export class SignUpInput {
  @IsEmail()
  @Field({ description: `이메일 주소` })
  email: string;

  @Field({ description: `비밀번호` })
  password: string;

  @Field({ description: `사용자 닉네임` })
  nickname: string;

  @ArrayMinSize(1)
  @Field(() => [String], { description: `동의하는 정책 ID 리스트` })
  policyIds: string[];

  @IsNumberString()
  @Field({ description: `인증 ID` })
  verificationId: string;

  @Field({ description: `인증 코드` })
  verificationCode: string;
}
