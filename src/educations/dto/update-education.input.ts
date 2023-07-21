import { IsDate, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateEducationInput {
  @IsNumberString()
  @Field()
  educationId: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  major: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description: string | null;

  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true })
  startDt: Date | null;

  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true })
  endDt: Date | null;

  @IsOptional()
  @IsNumberString()
  @Field(() => String, { nullable: true })
  schoolId: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  schoolName: string;
}
