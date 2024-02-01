import { InputType, Field } from '@nestjs/graphql';

@InputType({ description: `사용자 자신을 수정하기 위한 입력` })
export class UpdateMyselfInput {
  @Field(() => String, { description: `사용자 닉네임` })
  nickname: string;

  @Field(() => String, { nullable: true, description: `하는 일` })
  job: string | null;

  @Field(() => String, { nullable: true, description: `사용자에 대한 설명` })
  desc: string | null;
}
