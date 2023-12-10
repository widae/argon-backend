import { InputType, Field } from '@nestjs/graphql';
import { IsNumberString } from 'class-validator';

@InputType({ description: `구독 생성 관련 입력` })
export class CreateSubInput {
  @IsNumberString()
  @Field({ description: `출판인 ID` })
  publisherId: string;
}
