import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserInputDto } from './create-user-input.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    const users = await this.userModel.findAll();
    this.logger.log(`Fetched ${users.length} users`);
    return users;
  }

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

  async createUser(input: CreateUserInputDto): Promise<User> {
    this.logger.log(`Creating user with name: ${input.name}`);
    const user = await this.userModel.create({ ...input });
    this.logger.log(`Created user with id: ${user.id}`);
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    this.logger.log(`Deleting user with id: ${id}`);
    const user = await this.userModel.findByPk(id);

    if (!user) {
      this.logger.error(`User not found with id: ${id}`);
      throw new Error('User not found');
    }

    await user.destroy();
    this.logger.log(`Deleted user with id: ${id}`);
    return true;
  }
}
