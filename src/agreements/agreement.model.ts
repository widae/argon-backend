import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../users/user.model';
import { Policy } from '../policies/policy.model';

@Unique(['userId', 'policyId'])
@Entity()
export class Agreement {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  userId: string;

  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user?: User;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  policyId: string;

  @ManyToOne(() => Policy, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
  policy?: Policy;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
