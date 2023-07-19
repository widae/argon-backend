import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { LoginResult } from './models/login-result.model';
import { LoginInput } from './dto/login.input';
import { GqlRefreshGuard } from './guards/gql-refresh.guard';
import { JwtRefreshTokenPayload } from './interfaces/jwt-refresh-token-payload.interface';
import { RefreshResult } from './models/refresh-result.model';
import { CurRefreshTokenPayload } from './decorators/cur-refresh-token-payload.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResult)
  async logIn(@Args('input') input: LoginInput) {
    return await this.authService.logIn(input.email, input.password);
  }

  @UseGuards(GqlRefreshGuard)
  @Mutation(() => RefreshResult)
  async refresh(@CurRefreshTokenPayload() payload: JwtRefreshTokenPayload) {
    return await this.authService.refresh(payload);
  }
}
