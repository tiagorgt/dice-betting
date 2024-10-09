import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BetService } from './bet.service';
import { Bet } from './bet.model';

@Resolver(() => Bet)
export class BetResolver {
  constructor(private betService: BetService) {}

  @Query(() => Bet)
  async getBet(@Args('id') id: number): Promise<Bet> {
    return this.betService.findOne(id);
  }

  @Query(() => [Bet])
  async getBetList(): Promise<Bet[]> {
    return this.betService.findAll();
  }

  @Query(() => [Bet])
  async getBestBetPerUser(@Args('limit') limit: number): Promise<Bet[]> {
    return this.betService.getBestBetPerUser(limit);
  }

  @Mutation(() => Bet)
  async createBet(
    @Args('userId') userId: number,
    @Args('betAmount') betAmount: number,
    @Args('chance') chance: number,
  ): Promise<Bet> {
    return this.betService.createBet(userId, betAmount, chance);
  }
}
