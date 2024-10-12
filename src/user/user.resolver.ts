import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { description: 'Fetches a single user by their ID' })
  async getUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => [User], { description: 'Fetches all users' })
  async getUserList(): Promise<User[]> {
    return this.userService.findAll();
  }
}
