import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async getUser(@Args('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => [User])
  async getUserList(): Promise<User[]> {
    return this.userService.findAll();
  }
}