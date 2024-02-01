import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LogInType } from './enums/log-in-type.enum';
import { Expose } from 'class-transformer';
import { ExposeTo } from '../common/enums/expose-to.enum';

@ObjectType({ description: `사용자` })
@Entity()
export class User {
  @Field({ description: `사용자 ID` })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field(() => String, {
    nullable: true,
    description: `이메일 주소 (화자에게만 노출)`,
  })
  @Expose({ groups: [ExposeTo.ME] })
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

  @Column({
    type: 'varchar',
    nullable: true,
  })
  imageName: string | null;

  @Field(() => String, { nullable: true, description: `사용자 이미지 URL` })
  imageUrl: string | null;

  @Field(() => String, { nullable: true, description: `하는 일` })
  @Column({
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  job: string | null;

  @Field(() => String, { nullable: true, description: `사용자에 대한 설명` })
  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  desc: string | null;

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
