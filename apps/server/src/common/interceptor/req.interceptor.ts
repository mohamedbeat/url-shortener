// detailed-logging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class DetailedLoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP Interceptor');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const { method, originalUrl, httpVersion } = request;
        const userAgent = request.get('user-agent') || '';
        const ip = this.getClientIp(request);
        const startTime = Date.now();

        // Log request start
        this.logger.log(
            `🚀 ${method} ${originalUrl} [${httpVersion}] | IP: ${ip} | Agent: ${userAgent}`
        );

        // Add response listener
        response.on('finish', () => {
            const duration = Date.now() - startTime;
            const { statusCode, statusMessage } = response;
            const contentLength = response.get('content-length') || 0;

            const logMessage = `${method} ${originalUrl} ${statusCode} ${statusMessage} | ${duration}ms | ${contentLength}b | ${ip}`;

            if (statusCode >= 500) {
                this.logger.error(logMessage);
            } else if (statusCode >= 400) {
                this.logger.warn(logMessage);
            } else {
                this.logger.log(logMessage);
            }
        });

        return next.handle();
    }

    private getClientIp(request: Request): string {
        return (
            request.headers['x-forwarded-for'] as string ||
            request.headers['x-real-ip'] as string ||
            request.socket.remoteAddress ||
            'unknown'
        ).split(',')[0];
    }
}