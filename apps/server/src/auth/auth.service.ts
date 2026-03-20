import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { createUser, User } from './entities/user.entity';
import { Request } from 'express';
import DeviceDetector from 'device-detector-js';
import * as geoip from 'geoip-lite';
import * as countries from 'i18n-iso-countries';
import bcrypt from 'node_modules/bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { Session } from './entities/session.entity';


export type DeviceInfo = {
    browser?: string;
    os?: string;
    deviceType?: string; // 'desktop', 'smartphone', 'tablet'
    isMobile?: boolean;
    bot?: boolean;
    referer?: string
    country?: string
}
export type SessionDeviceInfo = {
    browser?: string;
    os?: string;
    deviceType?: string; // 'desktop', 'smartphone', 'tablet'
    country?: string
}



@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name)

    private deviceDetector = new DeviceDetector();

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Session)
        private sessionRepo: Repository<Session>,

        private jwtService: JwtService,
    ) { }

    async validateGoogleUser(details: createUser) {
        let user = await this.userRepository.findOneBy({ email: details.email });

        if (!user) {
            user = this.userRepository.create(details);
            await this.userRepository.save(user);
        }

        await this.updateChangedData(details, user)

        return user;
    }

    generateJwt(userId: string) {
        const payload = { id: userId, };
        return this.jwtService.sign(payload);
    }

    async createSession(userId: string, deviceInfo: SessionDeviceInfo) {
        const rawRefreshToken = randomBytes(40).toString('hex')
        const hashedRefreshToken = createHash('sha256').update(rawRefreshToken).digest('hex')

        const session = this.sessionRepo.create({
            userId,
            refreshTokenHash: hashedRefreshToken,
            ...deviceInfo,
        })

        await this.sessionRepo.save(session)

        return rawRefreshToken

    }

    async getSession(userId: string, rawRefresh: string) {
        const refreshHash = createHash('sha256').update(rawRefresh).digest('hex')

        const session = await this.sessionRepo.findOneBy({
            refreshTokenHash: refreshHash,
            userId: userId
        })
        return session
    }

    /**
     * checking for session validity, for now its only checking for expiry
     * 
     * @param session 
     * @returns boolean
     */
    async isSessionValid(session: Session): Promise<boolean> {
        // Check if session exists
        if (!session) {
            return false;
        }

        // Check if session has expired
        const now = new Date();
        if (now > session.expiresAt) {
            return false;
        }

        return true;
    }

    async login(user: User, req: Request) {
        const accessToken = this.generateJwt(user.id)
        const deviceInfo = await this.getDeviceInfo(req)
        const info: SessionDeviceInfo = {
            browser: deviceInfo?.browser,
            country: deviceInfo?.country,
            deviceType: deviceInfo?.deviceType,
            os: deviceInfo?.deviceType
        }
        const session = await this.createSession(user.id, info)
        return {
            accessToken: accessToken,
            refreshToken: session
        }

    }

    async refreshTokens(rawRefreshToken: string, accessToken: string) {
        const result = await this.verifyTokenIgnoringExpiry(accessToken)
        if (!result.isValid) {
            this.logger.error('invalid signature')
            throw new UnauthorizedException()
        }

        const session = await this.getSession(result.payload.id, rawRefreshToken)
        if (!session) {
            this.logger.error('session not found')
            throw new UnauthorizedException()
        }

        const isSessionValid = await this.isSessionValid(session)

        if (!isSessionValid) {
            this.logger.error('expired session ')
            throw new UnauthorizedException()
        }

        const newRefresh = await this.createSession(result.payload.id, { browser: session.browser, country: session.country, deviceType: session.deviceType, os: session.os })
        const newAccessToken = this.generateJwt(session.userId)

        // deleting old session
        await this.sessionRepo.delete({
            id: session.id
        })

        return {
            accessToken: newAccessToken,
            refreshToken: newRefresh
        }
    }


    async verifyTokenIgnoringExpiry(token: string) {
        try {
            const payload = this.jwtService.verify(token, {
                ignoreExpiration: true,
            });

            return {
                isValid: true,
                payload,
                isExpired: payload.exp * 1000 < Date.now()
            };
        } catch (error) {
            return {
                isValid: false,
                error: error.message
            };
        }
    }

    async updateChangedData(details: createUser, user: User) {
        if (user.picture !== details.picture) {
            user.picture = details.picture
        }
        if (user.firstName !== details.firstName) {
            user.firstName = details.firstName
        }

        if (user.lastName !== details.lastName) {
            user.lastName = details.lastName
        }
        await this.userRepository.save(user)
    }


    async getDeviceInfo(req: Request): Promise<DeviceInfo | undefined> {
        const userAgent = req.headers['user-agent'];
        const referer = req.headers.referer;
        const ipAddress = req.ip || req.socket.remoteAddress;

        const info: Partial<DeviceInfo> = {};

        if (userAgent) {
            const deviceInfo = this.deviceDetector.parse(userAgent);

            Object.assign(info, {
                browser: deviceInfo.client?.name || "unknown",
                os: deviceInfo.os?.name || "unknown",
                deviceType: deviceInfo.device?.type || "unknown",
                isMobile: deviceInfo.device?.type === 'smartphone',
                bot: !!deviceInfo.bot
            });
        }

        if (referer) {
            info.referer = referer;
        }

        if (ipAddress) {

            const geo = geoip.lookup(ipAddress)
            if (geo) {
                info.country = countries.getName(geo.country, "en")
            }
        }
        // Check if any property has a truthy value
        const hasAnyData = Object.values(info).some(value => value !== undefined);

        return hasAnyData ? info as DeviceInfo : undefined;
    }
}
