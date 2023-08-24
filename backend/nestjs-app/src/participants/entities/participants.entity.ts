import {
  BaseEntity,
  BeforeInsert,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Column, Entity } from 'typeorm';
import { ChatChannel } from 'src/chatting/entities/chatchannel.entity';
import { User } from 'src/users/entities/user.entity';
import * as moment from 'moment-timezone';

@Entity()
export class Participants extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  owner: boolean;

  @Column()
  admin: boolean;

  @Column()
  muted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @BeforeInsert()
  transformDates() {
    this.createdAt = moment(this.createdAt).tz('Asia/Seoul').toDate();
  }

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => ChatChannel, (channel) => channel.id, {
    onDelete: 'CASCADE',
  })
  channel: ChatChannel;
}
