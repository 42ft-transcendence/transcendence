import { Message } from 'src/message/entities/message.entity';
import { Participants } from 'src/participants/entities/participants.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';

@Entity()
export class ChatChannel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  password: string;

  @OneToMany(() => Participants, (participant) => participant.channel, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  participants: Participants[];

  @ManyToOne(() => User, (user) => user.channels, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Message, (message) => message.channelId)
  messages: Message[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @BeforeInsert()
  transformDates() {
    this.createdAt = moment(this.createdAt).tz('Asia/Seoul').toDate();
  }
}
