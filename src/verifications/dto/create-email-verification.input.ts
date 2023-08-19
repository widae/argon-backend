import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType({ description: `이메일 인증 생성을 위한 입력` })
export class CreateEmailVerificationInput {
  @IsEmail()
  @Field({ description: `이메일 주소` })
  email: string;
}
