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

  @ManyToOne(() => ChatChannel, (room) => room.id, {
    onDelete: 'CASCADE',
  })
  room: ChatChannel;

  //   channel: Channel;
  //   @AfterUpdate()
  //   mutedtimer() {
  //     if (this.muted == true) {
  //       setTimeout(() => {
  //         this.muted = false;
  //         this.save();
  //       }, 10000);
  //     }
  //   }
}
// @OneToMany((type) => Channel, (channels) => channels.owner)
// channels: Channel[];

// @OneToMany((type) => ChannelParticipant, (participant) => participant.user)
// participants: ChannelParticipant[];

// @OneToMany((type) => ChannelMessage, (cm) => cm.sender)
// messages: ChannelMessage[];

// @OneToMany((type) => DM, (dm) => dm.to)
// to: DM[];

// @OneToMany((type) => DM, (dm) => dm.from)
// from: DM[];

// @ManyToMany((type) => Channel, (channel) => channel.ban_users)
// ban_channels: Channel[];
