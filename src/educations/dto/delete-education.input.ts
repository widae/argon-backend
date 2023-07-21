import { IsNumberString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteEducationInput {
  @IsNumberString()
  @Field()
  educationId: string;
}
