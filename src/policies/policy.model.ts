import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@ObjectType({ description: `정책` })
@Entity()
export class Policy {
  @Field({ description: `정책 ID` })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field({ description: `정책명` })
  @Column()
  name: string;

  @Field({ description: `동의 필요 여부` })
  @Column()
  isRequired: boolean;

  @Field({ description: `생성 일시` })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: `수정 일시` })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true, description: `삭제 일시` })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
