import { BetResolver } from './bet.resolver';
import { BetService } from './bet.service';
import * as SequelizeMock from 'sequelize-mock';

describe('BetResolver', () => {
  let resolver: BetResolver;
  let service: BetService;
  let betMock: any;
  let userMock: any;

  beforeEach(() => {
    const dbMock = new SequelizeMock();

    betMock = dbMock.define('Bet', {
      id: 1,
      userId: 1,
      betAmount: 100,
      chance: 0.5,
      payout: 200,
      win: true,
    });

    userMock = dbMock.define('User', {
      id: 1,
      name: 'John Doe',
      balance: 1000,
    });

    service = new BetService(betMock, userMock);
    resolver = new BetResolver(service);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getBet', () => {
    it('should return a single bet', async () => {
      const result = betMock.build();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await resolver.getBet(1)).toBe(result);
    });
  });

  describe('getBetList', () => {
    it('should return an array of bets', async () => {
      const result = [betMock.build()];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getBetList()).toBe(result);
    });
  });

  describe('createBet', () => {
    it('should create a new bet', async () => {
      const result = betMock.build();
      jest.spyOn(service, 'createBet').mockResolvedValue(result);

      expect(await resolver.createBet(1, 100, 0.5)).toBe(result);
    });
  });

  describe('getBestBetPerUser', () => {
    it('should return the best bets per user', async () => {
      const result = [betMock.build()];
      jest.spyOn(service, 'getBestBetPerUser').mockResolvedValue(result);

      expect(await resolver.getBestBetPerUser(5)).toBe(result);
    });
  });
});
