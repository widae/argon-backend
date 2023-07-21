import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsNumberString, Min } from 'class-validator';

@InputType()
export class UpdateEducationTheOrderInput {
  @Field()
  @IsNumberString()
  educationId: string;

  @Field()
  @IsNumber()
  @Min(0)
  order: number;
}
