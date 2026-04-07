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
// import { EnvService } from 'src/config/env/env.service';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { EnvService } from '../config/env/env.service';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name)

  private deviceDetector = new DeviceDetector();
  private preferredCountryNames: { [code: string]: string } = {
    'CN': 'China',
    'KR': 'South Korea',  // i18n might return "Republic of Korea"
    // Add any other countries with preferred short names
  };

  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly envService: EnvService,
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

  getCountryDisplayName(countryCode: string, locale: string = 'en'): string {
    // Check if we have a preferred name for this country
    if (this.preferredCountryNames[countryCode]) {
      return this.preferredCountryNames[countryCode];
    }

    // Otherwise use the i18n library
    return countries.getName(countryCode, locale) || countryCode;
  }
  async getDeviceInfo(req: Request): Promise<DeviceInfo | undefined> {
    countries.registerLocale(enLocale);
    const userAgent = req.headers['user-agent'];
    const referer = req.headers.referer;
    let ipAddress = req.ip || req.socket.remoteAddress;

    if (this.envService.isDevelopment()) {
      ipAddress = this.generatePublicIP()
    }


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
        // info.country = countries.getName(geo.country, "en")
        info.country = this.getCountryDisplayName(geo.country, 'en')
      }
    }
    // Check if any property has a truthy value
    const hasAnyData = Object.values(info).some(value => value !== undefined);

    return hasAnyData ? info as DeviceInfo : undefined;
  }


  /**
* Generates a random IP address that looks realistic (non-reserved, valid ranges)
* @param options Configuration options for IP generation
* @returns A valid IPv4 address string
*/
  generateRandomIP(options: RandomIPOptions = {}): string {
    // Private IP ranges (CIDR notation)
    const privateRanges = [
      { start: [10, 0, 0, 0], end: [10, 255, 255, 255] },        // 10.0.0.0/8
      { start: [172, 16, 0, 0], end: [172, 31, 255, 255] },      // 172.16.0.0/12
      { start: [192, 168, 0, 0], end: [192, 168, 255, 255] },    // 192.168.0.0/16
      { start: [127, 0, 0, 0], end: [127, 255, 255, 255] }       // 127.0.0.0/8 (localhost)
    ];

    // Common public IP ranges by region (simplified for development)
    const countryRanges: Record<string, Array<{ start: number[]; end: number[] }>> = {
      US: [{ start: [8, 0, 0, 0], end: [8, 255, 255, 255] },      // Level 3 Communications
      { start: [4, 0, 0, 0], end: [4, 255, 255, 255] },      // Level 3
      { start: [12, 0, 0, 0], end: [12, 255, 255, 255] },     // AT&T
      { start: [24, 0, 0, 0], end: [24, 255, 255, 255] }],    // Comcast
      GB: [{ start: [31, 0, 0, 0], end: [31, 255, 255, 255] },     // BT
      { start: [81, 0, 0, 0], end: [81, 255, 255, 255] }],     // Sky UK
      JP: [{ start: [27, 0, 0, 0], end: [27, 255, 255, 255] },     // SoftBank
      { start: [126, 0, 0, 0], end: [126, 255, 255, 255] }],   // NTT
      DE: [{ start: [62, 0, 0, 0], end: [62, 255, 255, 255] },     // Deutsche Telekom
      { start: [79, 0, 0, 0], end: [79, 255, 255, 255] }]      // Vodafone DE
    };

    let ipRange: { start: number[]; end: number[] };

    if (options.simulateCountry && countryRanges[options.simulateCountry]) {
      // Use country-specific ranges
      const ranges = countryRanges[options.simulateCountry];
      ipRange = ranges[Math.floor(Math.random() * ranges.length)];
    } else if (options.privateOnly) {
      // Use private ranges only
      ipRange = privateRanges[Math.floor(Math.random() * privateRanges.length)];
    } else if (options.publicOnly) {
      // Generate completely random public IP (excluding reserved ranges)
      return this.generatePublicIP();
    } else {
      // Mix of private and public (60% public, 40% private for realism)
      const usePublic = Math.random() < 0.6;
      if (usePublic) {
        return this.generatePublicIP();
      }
      ipRange = privateRanges[Math.floor(Math.random() * privateRanges.length)];
    }

    return this.generateIPFromRange(ipRange.start, ipRange.end);
  }

  /**
   * Generates a completely random public IP address
   * Excludes private, reserved, and multicast ranges
   */
  generatePublicIP(): string {
    const octets: number[] = [];

    // First octet restrictions (public ranges only)
    const validFirstOctets = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
      43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
      62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
      81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
      115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 128, 129, 130, 131,
      132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146,
      147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161,
      162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176,
      177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191,
      192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206,
      207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221,
      222, 223
    ];

    const firstOctet = validFirstOctets[Math.floor(Math.random() * validFirstOctets.length)];
    octets.push(firstOctet);

    // Generate remaining octets
    for (let i = 1; i < 4; i++) {
      octets.push(Math.floor(Math.random() * 256));
    }

    return octets.join('.');
  }

  /**
   * Generates an IP address within a specific range
   */
  generateIPFromRange(start: number[], end: number[]): string {
    const octets: number[] = [];

    for (let i = 0; i < 4; i++) {
      const min = start[i];
      const max = end[i];
      octets.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    return octets.join('.');
  }

  /**
   * Generates multiple random IP addresses
   * @param count Number of IP addresses to generate
   * @param options Same options as generateRandomIP
   * @returns Array of IP addresses
   */
  generateRandomIPs(count: number, options: RandomIPOptions = {}): string[] {
    return Array.from({ length: count }, () => this.generateRandomIP(options));
  }


}
export interface RandomIPOptions {
  /** Include only private IP ranges (for internal testing) */
  privateOnly?: boolean;
  /** Include only public IP ranges */
  publicOnly?: boolean;
  /** Specific country code to simulate (e.g., 'US', 'GB', 'JP') - approximate ranges */
  simulateCountry?: string;
}
