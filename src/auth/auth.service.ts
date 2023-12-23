import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.providers';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogInResult } from './models/log-in-result.model';
import { USERS_REPOSITORY } from '../common/constants';
import { CustomHttpException } from '../common/exceptions/custom-http.exception';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../env.validation';
import { JwtAccessTokenPayload } from './interfaces/jwt-access-token-payload.interface';
import { JwtRefreshTokenPayload } from './interfaces/jwt-refresh-token-payload.interface';
import { RefreshResult } from './models/refresh-result.model';
import { GoogleOauth2Service } from '../google-oauth2/google-oauth2.service';
import { jwtDecode } from 'jwt-decode';
import { GoogleIdTokenPayload } from '../google-oauth2/interfaces/google-id-token-payload.interface';

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;
  private readonly refreshTokenRenewalSeconds: number;
  private readonly redis: Redis;

  constructor(
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly googleOauth2Service: GoogleOauth2Service,
    private readonly jwtService: JwtService,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
  ) {
    this.accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET', {
      infer: true,
    });
    this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET', {
      infer: true,
    });
    this.accessTokenExpiresIn = this.configService.get(
      'ACCESS_TOKEN_EXPIRES_IN',
      { infer: true },
    );
    this.refreshTokenExpiresIn = this.configService.get(
      'REFRESH_TOKEN_EXPIRES_IN',
      { infer: true },
    );
    this.refreshTokenRenewalSeconds = this.configService.get(
      'REFRESH_TOKEN_RENEWAL_SECONDS',
      { infer: true },
    );
    this.redis = this.redisService.getClient();
  }

  async logIn(email: string, password: string): Promise<LogInResult> {
    const user = await this.validate(email, password);

    if (!user) {
      throw new CustomHttpException('E_401_000');
    }

    return await this.generateTokens(user.id);
  }

  async validate(email: string, password: string) {
    const user = await this.usersRepository.getByEmail(email);

    if (user) {
      const isEqual =
        user.password == null
          ? false
          : await bcrypt.compare(password, user.password);

      if (isEqual) {
        return user;
      }
    }

    return null;
  }

  async generateTokens(sub: string): Promise<LogInResult> {
    const cmn = uuidv4();

    const accessToken = await this.generateAccessToken(sub, cmn);
    const refreshToken = await this.generateRefreshToken(sub, cmn);

    return { accessToken, refreshToken };
  }

  async generateAccessToken(sub: string, cmn: string) {
    /* 생성 */
    const jti = uuidv4();

    const part: Partial<JwtAccessTokenPayload> = {
      jti,
      sub,
      cmn,
    };

    const token = this.jwtService.sign(part, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiresIn,
    });

    /* 저장 */
    const ttl = this.accessTokenExpiresIn + 60;

    await this.redis.set(`access-token:${sub}:${cmn}:${jti}`, token, 'EX', ttl);

    /* 반환 */
    return token;
  }

  async generateRefreshToken(sub: string, cmn: string) {
    /* 생성 */
    const jti = uuidv4();

    const part: Partial<JwtRefreshTokenPayload> = {
      jti,
      sub,
      cmn,
    };

    const token = this.jwtService.sign(part, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiresIn,
    });

    /* 저장 */
    const ttl = this.refreshTokenExpiresIn + 60;

    await this.redis.set(
      `refresh-token:${sub}:${cmn}:${jti}`,
      token,
      'EX',
      ttl,
    );

    /* 반환 */
    return token;
  }

  async logInWithGoogle(code: string): Promise<LogInResult> {
    const user = await this.validateGoogleCode(code);

    if (!user) {
      throw new CustomHttpException('E_401_000');
    }

    return await this.generateTokens(user.id);
  }

  async validateGoogleCode(code: string) {
    const { id_token: idToken } = await this.googleOauth2Service.getTokens(
      code,
    );

    if (idToken == null) {
      throw new Error('ID 토큰 값이 문자열이 아닙니다.');
    }

    const { email } = jwtDecode<GoogleIdTokenPayload>(idToken);

    return await this.usersRepository.getByEmail(email);
  }

  async refresh(
    refreshTokenPayload: JwtRefreshTokenPayload,
  ): Promise<RefreshResult> {
    /* 접근 토큰 설정 */
    const accessToken = await this.generateAccessToken(
      refreshTokenPayload.sub,
      refreshTokenPayload.cmn,
    );
    /* 리프레시 토큰 설정 */
    let refreshToken: string | null = null;
    const expiresIn = refreshTokenPayload.exp - Math.round(Date.now() / 1000);
    if (this.refreshTokenRenewalSeconds > expiresIn) {
      refreshToken = await this.generateRefreshToken(
        refreshTokenPayload.sub,
        refreshTokenPayload.cmn,
      );
    }
    /* 반환 */
    return { accessToken, refreshToken };
  }
}
