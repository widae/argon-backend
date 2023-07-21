import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchSchoolsInput {
  @Field()
  keyword: string;
}
