import { Message } from 'src/message/entities/message.entity';
import { Participants } from 'src/participants/entities/participants.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  password: string;

  @OneToMany(() => Participants, (participant) => participant.room, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  participants: Participants[];

  @ManyToOne(() => User, (user) => user.rooms, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Message, (message) => message.roomId)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
