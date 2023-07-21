import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@ObjectType()
@Entity()
export class School {
  @Field()
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field()
  @Column()
  @Index(['name'], { fulltext: true, parser: 'ngram' })
  name: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
