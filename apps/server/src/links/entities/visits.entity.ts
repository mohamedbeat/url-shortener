import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Index,
    JoinColumn,
} from 'typeorm';
import { Link } from './link.entity';

@Entity()
export class Visit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Link, (link) => link.visits, {
        onDelete: 'CASCADE', // When a link is deleted, its visits are also deleted
    })
    @JoinColumn({ name: 'linkId' })
    link: Link;

    @Column()
    @Index() // Index for faster queries when filtering by link
    linkId: string;

    // Device Information
    @Column({ nullable: true })
    browser?: string;

    @Column({ nullable: true })
    os?: string;

    @Column({ nullable: true })
    deviceType?: string; // 'desktop', 'smartphone', 'tablet'

    @Column({ nullable: true })
    isMobile?: boolean;

    @Column({ nullable: true })
    bot?: boolean;

    // Additional tracking information
    @Column({ nullable: true })
    @Index() // Index for analytics queries
    ipAddress?: string;


    @Column({ nullable: true })
    referer?: string;


    // Location information (if you want to add this)
    @Column({ nullable: true })
    country?: string;

    @Column({ nullable: true })
    city?: string;


    @CreateDateColumn()
    @Index()
    visitedAt: Date;
}