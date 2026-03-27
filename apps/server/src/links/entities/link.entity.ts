import {
  BeforeInsert,
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
@Index(['url', 'userId'])
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column({
    unique: false
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


  @Column({ nullable: true })
  @Index()
  expiresAt: Date;

  @Column({ default: false })
  isExpired: boolean;




  @BeforeInsert()
  calculateExpiryDate() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    // expiryDate.setSeconds(expiryDate.getSeconds() + 60 * 2);
    this.expiresAt = expiryDate
  }


}
