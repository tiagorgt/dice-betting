import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bet } from './bet.model';
import { User } from '../user/user.model';

@Injectable()
export class BetService {
  constructor(
    @InjectModel(Bet)
    private betModel: typeof Bet,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<Bet[]> {
    return this.betModel.findAll();
  }

  async findOne(id: number): Promise<Bet> {
    return this.betModel.findByPk(id);
  }

  async createBet(
    userId: number,
    betAmount: number,
    chance: number,
  ): Promise<Bet> {
    const user = await this.userModel.findByPk(userId);
    if (!user || user.balance < betAmount) {
      throw new Error('Insufficient balance or user not found');
    }

    const win = Math.random() < chance;
    const payout = win ? betAmount * (1 / chance) : 0;

    user.balance += payout - betAmount;
    await user.save();

    return this.betModel.create({ userId, betAmount, chance, payout, win });
  }

  async getBestBetPerUser(limit: number): Promise<Bet[]> {
    return this.betModel.findAll({
      group: ['userId'],
      order: [['payout', 'DESC']],
      limit,
    });
  }
}
