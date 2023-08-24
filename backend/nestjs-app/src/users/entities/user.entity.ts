import { Room } from 'src/chatting/entities/room.entity';
import { BaseEntity, OneToMany } from 'typeorm';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  nickname: string;

  @Column()
  win: number;

  @Column()
  lose: number;

  @Column()
  ladder_win: number;

  @Column()
  ladder_lose: number;

  @Column()
  admin: boolean;

  @Column()
  avatarPath: string;

  @Column()
  status: number;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret: string;

  @Column()
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ nullable: true })
  rating: number;

  @OneToMany(() => Room, (room) => room.owner)
  rooms: Room[];
}
