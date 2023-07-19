import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../../env.validation';
import { JwtRefreshTokenPayload } from '../interfaces/jwt-refresh-token-payload.interface';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { IncomingMessage } from 'http';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  private readonly redis: Redis;

  constructor(
    readonly configService: ConfigService<EnvVars, true>,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET', { infer: true }),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
    this.redis = this.redisService.getClient();
  }

  async validate(req: IncomingMessage, payload: JwtRefreshTokenPayload) {
    const refreshToken = await this.redis.get(
      `refresh-token:${payload.sub}:${payload.cmn}:${payload.jti}`,
    );

    return refreshToken &&
      req.headers.authorization === `Bearer ${refreshToken}`
      ? payload
      : null;
  }
}
