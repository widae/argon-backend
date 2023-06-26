import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateEmailVerificationInput {
  @IsEmail()
  @Field()
  email: string;
}
