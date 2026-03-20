
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromCookie(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            // 💡 Here the JWT secret key that's used for verifying the payload 
            // is the key that was passsed in the JwtModule
            const payload = await this.jwtService.verifyAsync(token);
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers

            const user = await this.userService.getUserById(payload.id)

            request['user'] = user;


        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        const accessToken = request.cookies['accessToken']
        return accessToken
    }
}
