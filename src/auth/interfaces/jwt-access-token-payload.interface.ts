export interface JwtAccessTokenPayload {
  jti: string;
  sub: string;
  exp: number;
  cmn: string;
}
