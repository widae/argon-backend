import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { LogInResult } from './models/log-in-result.model';
import { LogInInput } from './dto/log-in.input';
import { GqlRefreshGuard } from './guards/gql-refresh.guard';
import { JwtRefreshTokenPayload } from './interfaces/jwt-refresh-token-payload.interface';
import { RefreshResult } from './models/refresh-result.model';
import { CurRefreshTokenPayload } from './decorators/cur-refresh-token-payload.decorator';
import { LogInWithGoogleInput } from './dto/log-in-with-google.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LogInResult, {
    description: `
      * 기능
        - 이메일 & 비밀번호 로그인
      * 인증
        - 없음
    `,
  })
  async logIn(@Args('input') input: LogInInput) {
    return await this.authService.logIn(input.email, input.password);
  }

  @Mutation(() => LogInResult, {
    description: `
      * 기능
        - 구글 로그인
      * 인증
        - 없음
    `,
  })
  async logInWithGoogle(@Args('input') input: LogInWithGoogleInput) {
    return await this.authService.logInWithGoogle(input.code);
  }

  @UseGuards(GqlRefreshGuard)
  @Mutation(() => RefreshResult, {
    description: `
      * 기능
        - 엑세스 및 리스레시 토큰 발급
      * 인증
        - Bearer (JWT)
    `,
  })
  async refresh(@CurRefreshTokenPayload() payload: JwtRefreshTokenPayload) {
    return await this.authService.refresh(payload);
  }
}
