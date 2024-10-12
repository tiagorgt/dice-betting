import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  /**
   * Fetches all users.
   * @returns {Promise<User[]>} A promise that resolves to an array of users.
   */
  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    const users = await this.userModel.findAll();
    this.logger.log(`Fetched ${users.length} users`);
    return users;
  }

  /**
   * Fetches a single user by their ID.
   * @param {number} id - The ID of the user to fetch.
   * @returns {Promise<User>} A promise that resolves to the user.
   * @throws {Error} If the user is not found.
   */
  async findOne(id: number): Promise<User> {
    this.logger.log(`Fetching user with id: ${id}`);
    const user = await this.userModel.findByPk(id);

    if (!user) {
      this.logger.error(`User not found with id: ${id}`);
      throw new Error('User not found');
    }

    this.logger.log(`Fetched user with id: ${id}`);
    return user;
  }
}
