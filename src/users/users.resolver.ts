import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => Int)
  async createUser(@Args('input') input: CreateUserInput) {
    return await this.usersService.createUser(input);
  }
}
