import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BetService } from './bet.service';
import { Bet } from './bet.model';
import { CreateBetInputDto } from './create-bet-input.dto';

@Resolver(() => Bet)
export class BetResolver {
  constructor(private betService: BetService) {}

  @Query(() => Bet, { description: 'Fetches a single bet by its ID' })
  async getBet(@Args('id') id: number): Promise<Bet> {
    return this.betService.findOne(id);
  }

  @Query(() => [Bet], { description: 'Fetches all bets' })
  async getBetList(): Promise<Bet[]> {
    return this.betService.findAll();
  }

  @Query(() => [Bet], { description: 'Fetches the best bet per user' })
  async getBestBetPerUser(@Args('limit') limit: number): Promise<Bet[]> {
    return this.betService.getBestBetPerUser(limit);
  }

  @Mutation(() => Bet, { description: 'Creates a new bet' })
  async createBet(@Args('input') input: CreateBetInputDto): Promise<Bet> {
    return this.betService.createBet(
      input.userId,
      input.betAmount,
      input.chance,
    );
  }
}
