import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './users.service';
import { SignUpInput } from './dto/sign-up.input';
import { SignUpWithGoogleInput } from './dto/sign-up-with-google.input';
import { LogInResult } from '../auth/models/log-in-result.model';
import { AuthService } from '../auth/auth.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => LogInResult, {
    description: `
      * 기능
        - 이메일 & 비밀번호 회원 가입 (사용자 생성)
      * 인증
        - 없음
    `,
  })
  async signUp(@Args('input') input: SignUpInput) {
    const { userId } = await this.usersService.signUp(input);
    return await this.authService.generateTokens(userId);
  }

  @Mutation(() => LogInResult, {
    description: `
      * 기능
        - 구글 회원 가입 (사용자 생성)
      * 인증
        - 없음
    `,
  })
  async signUpWithGoogle(@Args('input') input: SignUpWithGoogleInput) {
    const { userId } = await this.usersService.signUpWithGoogle(input);
    return await this.authService.generateTokens(userId);
  }
}
