import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Visit } from './visits.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
@Index(['id', 'userId'])
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column({
    unique: true,
  })
  url: string;

  @Column({
    unique: true
  })
  shortHash: string;

  @Column({
    unique: true,
    nullable: true
  })
  customSlug: string

  @Column({
    default: 0
  })
  totalClicks: number

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Visit, (visit) => visit.link)
  visits: Visit[];

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.links, {
    onDelete: 'CASCADE', // When a link is deleted, its visits are also deleted
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    nullable: true
  })
  @Index()
  publicURL: string
}
