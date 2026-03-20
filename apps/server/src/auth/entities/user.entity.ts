// apps/server/src/auth/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Session } from './session.entity';
import { Link } from 'src/links/entities/link.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ nullable: true })
    picture?: string;

    @Column({ unique: true })
    googleId?: string; // Crucial for identifying returning Google users

    @OneToMany(() => Session, (session) => session.user)
    sessions: Session[];

    @OneToMany(() => Link, (link) => link.user)
    links: Link[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

export type createUser = Pick<User, 'email' | 'firstName' | 'lastName' | 'picture' | 'googleId'>