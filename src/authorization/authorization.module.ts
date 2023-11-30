import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        global: true,
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') }
      }),
      inject: [ConfigService]
    }),
    UsersModule
  ],
  providers: [AuthorizationService, ConfigService],
  controllers: [AuthorizationController]
})
export class AuthorizationModule { }
