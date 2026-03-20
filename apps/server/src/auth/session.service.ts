import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { SessionDeviceInfo } from './auth.types';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepo: Repository<Session>,
    ) { }

    async createSession(userId: string, deviceInfo: SessionDeviceInfo) {
        const rawRefreshToken = randomBytes(40).toString('hex');
        const hashedRefreshToken = createHash('sha256').update(rawRefreshToken).digest('hex');

        const session = this.sessionRepo.create({
            userId,
            refreshTokenHash: hashedRefreshToken,
            ...deviceInfo,
        });

        await this.sessionRepo.save(session);

        return rawRefreshToken;
    }

    async getSession(userId: string, rawRefresh: string) {
        const refreshHash = createHash('sha256').update(rawRefresh).digest('hex');
        return this.sessionRepo.findOneBy({
            refreshTokenHash: refreshHash,
            userId,
        });
    }

    async isSessionValid(session: Session): Promise<boolean> {
        if (!session) {
            return false;
        }

        return new Date() <= session.expiresAt;
    }

    async deleteSessionById(id: string) {
        await this.sessionRepo.delete({ id });
    }
}
