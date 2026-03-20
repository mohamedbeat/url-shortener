import { BeforeInsert, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";



@Entity()
export class Session {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    refreshTokenHash: string

    // Device Information
    @Column({ nullable: true })
    browser?: string;

    @Column({ nullable: true })
    os?: string;

    @Column({ nullable: true })
    deviceType?: string; // 'desktop', 'smartphone', 'tablet'


    // Additional tracking information
    @Column({ nullable: true })
    ipAddress?: string;


    // Location information (if you want to add this)
    @Column({ nullable: true })
    country?: string;

    @Column({ nullable: true })
    city?: string;

    @Column()
    @Index() // Index for faster queries when filtering by link
    userId: string;

    @ManyToOne(() => User, (user) => user.sessions, {
        onDelete: 'CASCADE', // When a link is deleted, its visits are also deleted
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    expiresAt: Date

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    setExpiresAt() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.expiresAt = tomorrow;
    }

}