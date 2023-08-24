import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class MatchHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1Score: number;

  @Column()
  player2Score: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  player1: User;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  player2: User;

  @Column()
  gameMode: string;
}
