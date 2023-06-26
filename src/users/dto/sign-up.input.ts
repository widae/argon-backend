import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize, IsEmail, IsNumberString } from 'class-validator';

@InputType()
export class SignUpInput {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  nickname: string;

  @ArrayMinSize(1)
  @Field(() => [String])
  policyIds: string[];

  @IsNumberString()
  @Field()
  verificationId: string;

  @Field()
  verificationCode: string;
}
