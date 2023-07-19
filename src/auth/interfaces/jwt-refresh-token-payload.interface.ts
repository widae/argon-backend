export interface JwtRefreshTokenPayload {
  jti: string;
  sub: string;
  exp: number;
  cmn: string;
}
