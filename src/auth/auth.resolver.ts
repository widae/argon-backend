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

  @Mutation(() => LogInResult)
  async logIn(@Args('input') input: LogInInput) {
    return await this.authService.logIn(input.email, input.password);
  }

  @Mutation(() => LogInResult)
  async logInWithGoogle(@Args('input') input: LogInWithGoogleInput) {
    return await this.authService.logInWithGoogle(input.code);
  }

  @UseGuards(GqlRefreshGuard)
  @Mutation(() => RefreshResult)
  async refresh(@CurRefreshTokenPayload() payload: JwtRefreshTokenPayload) {
    return await this.authService.refresh(payload);
  }
}
