import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../../env.validation';
import { JwtAccessTokenPayload } from '../interfaces/jwt-access-token-payload.interface';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { IncomingMessage } from 'http';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  private readonly redis: Redis;

  constructor(
    readonly configService: ConfigService<EnvVars, true>,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET', { infer: true }),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
    this.redis = this.redisService.getClient();
  }

  async validate(req: IncomingMessage, payload: JwtAccessTokenPayload) {
    const accessToken = await this.redis.get(
      `access-token:${payload.sub}:${payload.cmn}:${payload.jti}`,
    );

    return accessToken && req.headers.authorization === `Bearer ${accessToken}`
      ? payload
      : null;
  }
}
