import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VerificationType } from './enums/verification-type.enum';

@ObjectType()
@Entity()
export class Verification {
  @Field()
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field(() => VerificationType)
  @Column({ type: 'enum', enum: VerificationType })
  type: VerificationType;

  @Field()
  @Column()
  key: string;

  @Column()
  code: string;

  @Field()
  @Column()
  isVerified: boolean;

  @Field()
  @Column({ precision: 6 })
  expiresAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
