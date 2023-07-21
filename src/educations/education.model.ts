import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { School } from '../schools/school.model';
import { User } from '../users/user.model';

@ObjectType()
@Entity()
@Index(['order'])
export class Education {
  @Field()
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Field(() => String, { nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
    comment: '전공',
  })
  major: string | null;

  @Field(() => String, { nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
    comment: '상세 설명',
  })
  description: string | null;

  @Field()
  @Column({
    type: 'int',
    comment: '순서',
    unsigned: true,
    default: 0,
  })
  order: number;

  @Field(() => Date, { nullable: true })
  @Column({
    type: 'date',
    nullable: true,
    comment: '입학 날짜',
  })
  startDt: Date | null;

  @Field(() => Date, { nullable: true })
  @Column({
    type: 'date',
    nullable: true,
    comment: '졸업 날짜',
  })
  endDt: Date | null;

  @Column({
    type: 'bigint',
    nullable: true,
    unsigned: true,
  })
  schoolId: string | null;

  @ManyToOne(() => School, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
  school?: School;

  @Column({
    comment: '학교 이름',
  })
  schoolName: string;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  userId: string;

  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user?: User;

  @Field()
  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    default: () => 'ON UPDATE CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
