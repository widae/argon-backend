import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Policy {
  @Field()
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  isRequired: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
