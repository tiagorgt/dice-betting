import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserInputDto } from './create-user-input.dto';

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

  /**
   * Creates a new user.
   * @param {CreateUserInputDto} input - The input data for creating a user.
   * @returns {Promise<User>} A promise that resolves to the created user.
   */
  @Mutation(() => User, { description: 'Creates a new user' })
  async createUser(@Args('input') input: CreateUserInputDto): Promise<User> {
    return this.userService.createUser(input);
  }

  /**
   * Deletes a user by their ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the user was deleted, false otherwise.
   */
  @Mutation(() => Boolean, { description: 'Deletes a user by their ID' })
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
