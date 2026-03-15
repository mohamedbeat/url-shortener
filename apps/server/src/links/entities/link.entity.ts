import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Visit } from './visits.entity';

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

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
}
