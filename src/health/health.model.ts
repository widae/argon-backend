import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: `헬스 체크 결과` })
export class Health {
  @Field({ description: `(전체) 상태` })
  status: 'ok';
}
