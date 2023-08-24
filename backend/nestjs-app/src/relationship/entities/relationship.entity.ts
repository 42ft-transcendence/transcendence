import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as moment from 'moment-timezone';

@Entity()
export class Relationship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @BeforeInsert()
  transformDates() {
    this.createdAt = moment(this.createdAt).tz('Asia/Seoul').toDate();
  }

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  from: User;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  to: User;
}
