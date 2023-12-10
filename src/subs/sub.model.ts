import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: `구독` })
@Unique(['subscriberId', 'publisherId'])
@Entity()
export class Sub {
  @Field({ description: `구독 ID` })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field({ description: `구독자 ID` })
  @Column({
    type: 'bigint',
    unsigned: true,
  })
  subscriberId: string;

  @Field(() => User, { nullable: true, description: `구독자` })
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriberId' })
  subscriber?: User | null;

  @Field({ description: `출판인 ID` })
  @Column({
    type: 'bigint',
    unsigned: true,
  })
  publisherId: string;

  @Field(() => User, { nullable: true, description: `출판인` })
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'publisherId' })
  publisher?: User | null;

  @Field({ description: `출판인의 구독 여부` })
  isAlsoSubscribing?: boolean;

  @Field({ description: `생성 일시` })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: `수정 일시` })
  @UpdateDateColumn()
  updatedAt: Date;
}
