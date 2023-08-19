import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType({ description: `로그인 입력` })
export class LoginInput {
  @IsEmail()
  @Field({ description: `이메일 주소` })
  email: string;

  @Field({ description: `비밀번호` })
  password: string;
}
