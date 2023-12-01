import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './authorization/authorization.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config/dist';
import { UsersModule } from './users/users.module';
import { NetworkLoggerMiddleware } from './common/middlewares/network-logger.middleware';
import { NetworkCorrelationMiddleware } from './common/middlewares/network-correlation.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI')
      }),
      inject: [ConfigService]
    }),
    AuthorizationModule,
    UsersModule
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(NetworkCorrelationMiddleware, NetworkLoggerMiddleware).forRoutes('*');
  }
}
