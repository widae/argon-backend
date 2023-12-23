import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LogInType } from './enums/log-in-type.enum';

@ObjectType({ description: `사용자` })
@Entity()
export class User {
  @Field({ description: `사용자 ID` })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field({ description: `이메일 주소` })
  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  logInType: LogInType;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string | null;

  @Field({ description: `사용자 닉네임` })
  @Column()
  nickname: string;

  @Field(() => Int, { description: `사용자의 구독 수` })
  @Column({ default: 0 })
  numSubs: number;

  @Field(() => Int, { description: `사용자의 구독자 수` })
  @Column({ default: 0 })
  numSubscribers: number;

  @Field({ description: `생성 일시` })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: `수정 일시` })
  @UpdateDateColumn()
  updatedAt: Date;
}
