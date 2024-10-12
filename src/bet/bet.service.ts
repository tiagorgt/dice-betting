import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bet } from './bet.model';
import { User } from '../user/user.model';

@Injectable()
export class BetService {
  private readonly logger = new Logger(BetService.name);

  constructor(
    @InjectModel(Bet)
    private betModel: typeof Bet,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  /**
   * Fetches all bets.
   * @returns {Promise<Bet[]>} A promise that resolves to an array of bets.
   */
  async findAll(): Promise<Bet[]> {
    this.logger.log('Fetching all bets');
    const bets = await this.betModel.findAll();
    this.logger.log(`Fetched ${bets.length} bets`);
    return bets;
  }

  /**
   * Fetches a single bet by its ID.
   * @param {number} id - The ID of the bet to fetch.
   * @returns {Promise<Bet>} A promise that resolves to the bet.
   * @throws {Error} If the bet is not found.
   */
  async findOne(id: number): Promise<Bet> {
    this.logger.log(`Fetching bet with id: ${id}`);
    const bet = await this.betModel.findByPk(id);

    if (!bet) {
      this.logger.error(`Bet not found with id: ${id}`);
      throw new Error('Bet not found');
    }

    this.logger.log(`Fetched bet with id: ${id}`);
    return bet;
  }

  /**
   * Creates a new bet.
   * @param {number} userId - The ID of the user placing the bet.
   * @param {number} betAmount - The amount of the bet.
   * @param {number} chance - The chance of winning the bet.
   * @returns {Promise<Bet>} A promise that resolves to the created bet.
   * @throws {Error} If the user is not found or has insufficient balance.
   */
  async createBet(
    userId: number,
    betAmount: number,
    chance: number,
  ): Promise<Bet> {
    this.logger.log(
      `Creating bet for userId: ${userId}, betAmount: ${betAmount}, chance: ${chance}`,
    );
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      this.logger.error(`User not found with id: ${userId}`);
      throw new Error('User not found');
    }

    if (user.balance < betAmount) {
      this.logger.error(`Insufficient balance for userId: ${userId}`);
      throw new Error('Insufficient balance');
    }

    const win = this.playDice(chance);
    const payout = win ? betAmount * (1 / chance) : 0;

    user.balance += payout - betAmount;
    await user.save();

    this.logger.log(
      `Bet created for userId: ${userId}, win: ${win}, payout: ${payout}`,
    );
    return this.betModel.create({ userId, betAmount, chance, payout, win });
  }

  /**
   * Simulates a dice roll to determine if the bet is won.
   * @param {number} chance - The chance of winning the bet.
   * @returns {boolean} True if the bet is won, false otherwise.
   */
  playDice(chance: number): boolean {
    const result = Math.random() < chance;
    this.logger.log(`Dice rolled with chance: ${chance}, result: ${result}`);
    return result;
  }

  /**
   * Fetches the best bet per user.
   * @param {number} limit - The maximum number of bets to fetch.
   * @returns {Promise<Bet[]>} A promise that resolves to an array of bets.
   */
  async getBestBetPerUser(limit: number): Promise<Bet[]> {
    this.logger.log(`Fetching best bet per user with limit: ${limit}`);
    const results = await this.betModel.sequelize.query(
      `
      SELECT b.*
      FROM "Bets" b
      INNER JOIN (
        SELECT "userId", MAX(payout) as max_payout
        FROM "Bets"
        GROUP BY "userId"
      ) bb ON b."userId" = bb."userId" AND b.payout = bb.max_payout
      LIMIT :limit
    `,
      {
        replacements: { limit },
        model: Bet,
        mapToModel: true,
      },
    );

    this.logger.log(`Best bets fetched: ${results.length}`);
    return results;
  }
}
