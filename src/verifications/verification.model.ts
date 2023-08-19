import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VerificationType } from './enums/verification-type.enum';

@ObjectType({ description: `인증` })
@Entity()
export class Verification {
  @Field({ description: `인증 ID` })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field(() => VerificationType, { description: '인증 유형' })
  @Column({ type: 'enum', enum: VerificationType })
  type: VerificationType;

  @Field({ description: `키 (예: 이메일)` })
  @Column()
  key: string;

  @Column()
  code: string;

  @Field({ description: `인증 여부` })
  @Column()
  isVerified: boolean;

  @Field({ description: `만료 일시` })
  @Column({ precision: 6 })
  expiresAt: Date;

  @Field({ description: `생성 일시` })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: `수정 일시` })
  @UpdateDateColumn()
  updatedAt: Date;
}
