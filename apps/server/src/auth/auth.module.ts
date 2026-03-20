import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from 'src/config/env/env.service';
import { GoogleStrategy } from './google.strategy';
import { Session } from './entities/session.entity';
import { UserService } from './user.service';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), JwtModule.registerAsync({
    inject: [EnvService],
    useFactory: async (env: EnvService) => ({
      global: true,
      secret: env.auth.jwtSecret,
      signOptions: {
        expiresIn: env.auth.jwtExpiresIn
      }
    })
  })],
  controllers: [AuthController],
  providers: [AuthService, UserService, SessionService, GoogleStrategy],
  exports: [AuthService, UserService, SessionService]
})
export class AuthModule { }
