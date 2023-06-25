import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize, IsEmail } from 'class-validator';

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
}
