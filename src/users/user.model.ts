import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  password: string;

  @Field({ description: `사용자 닉네임` })
  @Column()
  nickname: string;

  @Field({ description: `생성 일시` })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: `수정 일시` })
  @UpdateDateColumn()
  updatedAt: Date;
}
