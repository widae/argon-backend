import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './users.service';
import { SignUpInput } from './dto/sign-up.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => Int)
  async signUp(@Args('input') input: SignUpInput) {
    return await this.usersService.signUp(input);
  }
}
