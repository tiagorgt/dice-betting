import { BetService } from './bet.service';
import * as SequelizeMock from 'sequelize-mock';

describe('BetService', () => {
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

    betMock.findByPk = jest.fn();
    betMock.sequelize = { query: jest.fn() };
    userMock.findByPk = jest.fn();

    service = new BetService(betMock, userMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bets', async () => {
      const result = [betMock.build()];
      jest.spyOn(betMock, 'findAll').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single bet', async () => {
      const result = betMock.build();
      jest.spyOn(betMock, 'findByPk').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });
  });

  describe('createBet', () => {
    it('should throw an error if user not found', async () => {
      jest.spyOn(userMock, 'findByPk').mockResolvedValue(null);

      await expect(service.createBet(1, 100, 0.5)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error if insufficient balance', async () => {
      jest
        .spyOn(userMock, 'findByPk')
        .mockResolvedValue(userMock.build({ balance: 50 }));

      await expect(service.createBet(1, 100, 0.5)).rejects.toThrow(
        'Insufficient balance',
      );
    });

    it('should create a bet and update user balance if user loses', async () => {
      const user = userMock.build();
      user.balance = 200;
      jest.spyOn(userMock, 'findByPk').mockResolvedValue(user);
      jest.spyOn(user, 'save').mockResolvedValue(user);
      jest.spyOn(betMock, 'create').mockResolvedValue(betMock.build());
      jest.spyOn(service, 'playDice').mockReturnValue(false);

      const result = await service.createBet(1, 100, 0.5);

      expect(user.balance).toEqual(100); // balance 200 - bet 100 = 100
      expect(result).toBeInstanceOf(betMock.Instance);
    });

    it('should create a bet and update user balance if user wins', async () => {
      const user = userMock.build();
      user.balance = 200;
      jest.spyOn(userMock, 'findByPk').mockResolvedValue(user);
      jest.spyOn(user, 'save').mockResolvedValue(user);
      jest.spyOn(betMock, 'create').mockResolvedValue(betMock.build());
      jest.spyOn(service, 'playDice').mockReturnValue(true);

      const result = await service.createBet(1, 100, 0.1);

      expect(user.balance).toEqual(1100); // payout 1000 - bet 100 = 900 + 200 balance = 1100
      expect(result).toBeInstanceOf(betMock.Instance);
    });
  });

  describe('getBestBetPerUser', () => {
    it('should return the best bets per user', async () => {
      const result = betMock.build();
      jest.spyOn(betMock.sequelize, 'query').mockResolvedValue([result]);

      expect(await service.getBestBetPerUser(5)).toEqual([result]);
    });
  });

  describe('playDice', () => {
    it('should return true if random number is less than chance', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.1);

      expect(service.playDice(0.2)).toBe(true);
    });

    it('should return false if random number is greater than chance', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.3);

      expect(service.playDice(0.2)).toBe(false);
    });
  });
});
