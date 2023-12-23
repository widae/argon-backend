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

  @Mutation(() => LogInResult)
  async signUp(@Args('input') input: SignUpInput) {
    const { userId } = await this.usersService.signUp(input);
    return await this.authService.generateTokens(userId);
  }

  @Mutation(() => LogInResult)
  async signUpWithGoogle(@Args('input') input: SignUpWithGoogleInput) {
    const { userId } = await this.usersService.signUpWithGoogle(input);
    return await this.authService.generateTokens(userId);
  }
}
