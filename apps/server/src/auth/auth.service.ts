import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUser, User } from './entities/user.entity';
import { Request } from 'express';
import DeviceDetector from 'device-detector-js';
import * as geoip from 'geoip-lite';
import * as countries from 'i18n-iso-countries';
import { Session } from './entities/session.entity';
import { UserService } from './user.service';
import { SessionService } from './session.service';
import { DeviceInfo, SessionDeviceInfo } from './auth.types';


@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name)

    private deviceDetector = new DeviceDetector();

    constructor(
        private jwtService: JwtService,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
    ) { }

    async getUserById(id: string) {
        return this.userService.getUserById(id)
    }

    getSafeUserInfo(user: User): Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'picture' | 'createdAt'> {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            picture: user.picture,
            createdAt: user.createdAt
        }
    }

    async validateGoogleUser(details: createUser) {
        return this.userService.validateGoogleUser(details);
    }

    generateJwt(userId: string) {
        const payload = { id: userId, };
        return this.jwtService.sign(payload);
    }

    async createSession(userId: string, deviceInfo: SessionDeviceInfo) {
        return this.sessionService.createSession(userId, deviceInfo)
    }

    async getSession(userId: string, rawRefresh: string) {
        return this.sessionService.getSession(userId, rawRefresh)
    }

    /**
     * checking for session validity, for now its only checking for expiry
     * 
     * @param session 
     * @returns boolean
     */
    async isSessionValid(session: Session): Promise<boolean> {
        return this.sessionService.isSessionValid(session)
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
        await this.sessionService.deleteSessionById(session.id)

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

    async logout(rawAccessToken?: string, rawRefreshToken?: string) {
        // Invalidate the current refresh-token session (if we can identify it).
        if (!rawAccessToken || !rawRefreshToken) return;

        const result = await this.verifyTokenIgnoringExpiry(rawAccessToken);
        if (!result.isValid || !result.payload) return;

        const userId = (result.payload as any)?.id as string | undefined;
        if (!userId) return;

        const session = await this.getSession(userId, rawRefreshToken);
        if (!session) return;

        await this.sessionService.deleteSessionById(session.id);
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
