import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { Task } from './Task/entities/Task.entity';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './Task/task.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import * as path from 'path';

@Module({
  imports: [
    CacheModule.register(), // nécessaire pour Throttler
    ThrottlerModule.forRoot([{
      ttl: 60000,   // secondes
      limit: 3,  // max requêtes par TTL
    }as any]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env'
      ),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: Number(config.get('DATABASE_PORT')),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [User, Task],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    TaskModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, 
    },
  ],
})
export class AppModule {}
