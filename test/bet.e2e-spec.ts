import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { Bet } from '../src/bet/bet.model';
import { User } from '../src/user/user.model';
import { v4 as uuid } from 'uuid';

describe('BetResolver (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Sequelize)
      .useValue(
        new Sequelize({
          dialect: 'sqlite',
          storage: ':memory:',
          models: [Bet, User],
          logging: false,
        }),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({}));
    await app.init();

    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [Bet, User],
      logging: false,
      database: `test-${uuid()}`,
    });

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should return a single bet', async () => {
    await User.create({
      id: 1,
      name: 'John Doe',
      balance: 1000,
    });

    await Bet.create({
      id: 1,
      userId: 1,
      betAmount: 100,
      chance: 0.5,
      payout: 200,
      win: true,
    });

    const query = `
      query {
        getBet(id: 1) {
          id
          userId
          betAmount
          chance
          payout
          win
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.body.data.getBet).toBeDefined();
    expect(response.body.data.getBet.id).toBe('1');
  });

  it('should return an array of bets', async () => {
    await User.create({
      id: 1,
      name: 'John Doe',
      balance: 1000,
    });

    const bets = [
      {
        id: 1,
        userId: 1,
        betAmount: 100,
        chance: 0.5,
        payout: 200,
        win: true,
      },
      {
        id: 2,
        userId: 1,
        betAmount: 200,
        chance: 0.7,
        payout: 400,
        win: false,
      },
    ];

    await Bet.bulkCreate(bets);

    const query = `
      query {
        getBetList {
          id
          userId
          betAmount
          chance
          payout
          win
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.body.data.getBetList).toHaveLength(2);
    expect(response.body.data.getBetList).toMatchObject(
      bets.map((bet) => ({
        ...bet,
        userId: bet.userId.toString(),
        id: bet.id.toString(),
      })),
    );
  });

  it('should create a new bet', async () => {
    const user = await User.create({
      id: 1,
      name: 'John Doe',
      balance: 1000,
    });

    const mutation = `
      mutation {
        createBet(input: { userId: 1, betAmount: 100, chance: 0.5 }) {
          id
          userId
          betAmount
          chance
          payout
          win
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.body.data.createBet).toBeDefined();
    expect(response.body.data.createBet.userId).toBe(`${user.id}`);
    expect(response.body.data.createBet.betAmount).toBe(100);
  });

  it('should return null if bet is not found', async () => {
    const query = `
      query {
        getBet(id: 999) {
          id
          userId
          betAmount
          chance
          payout
          win
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('Bet not found');
  });

  it('should return an error if user is not found when creating a bet', async () => {
    const mutation = `
      mutation {
        createBet(input: { userId: 999, betAmount: 100, chance: 0.5 }) {
          id
          userId
          betAmount
          chance
          payout
          win
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('User not found');
  });

  it('should return an error if user balance is insufficient when creating a bet', async () => {
    await User.create({
      id: 1,
      name: 'John Doe',
      balance: 10,
    });

    const mutation = `
      mutation {
        createBet(input: { userId: 1, betAmount: 100, chance: 0.5 }) {
          id
          userId
          betAmount
          chance
          payout
          win
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('Insufficient balance');
  });

  it('should return an error if chance is not between 0 and 1 when creating a bet', async () => {
    const user = await User.create({
      name: 'John Doe',
      balance: 1000,
    });

    const mutation = `
      mutation {
        createBet(input: { userId: ${user.id}, betAmount: 100, chance: 1.1 }) {
          id
          userId
          betAmount
          chance
          payout
          win
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toEqual('Bad Request Exception');
    expect(response.body.errors[0].extensions.originalError.message).toContain(
      'Chance must be between 0 and 1',
    );
  });

  it('should return the best bet per user', async () => {
    const user1 = await User.create({ name: 'John Doe', balance: 1000 });
    const user2 = await User.create({ name: 'Jane Doe', balance: 2000 });

    await Bet.create({
      userId: user1.id,
      betAmount: 100,
      chance: 0.5,
      payout: 200,
      win: true,
    });
    await Bet.create({
      userId: user1.id,
      betAmount: 200,
      chance: 0.7,
      payout: 300,
      win: true,
    });
    await Bet.create({
      userId: user2.id,
      betAmount: 150,
      chance: 0.6,
      payout: 250,
      win: true,
    });
    await Bet.create({
      userId: user2.id,
      betAmount: 250,
      chance: 0.8,
      payout: 350,
      win: true,
    });

    const query = `
      query {
        getBestBetPerUser(limit: 2) {
          id
          userId
          betAmount
          chance
          payout
          win
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.body.data.getBestBetPerUser).toHaveLength(2);
    expect(response.body.data.getBestBetPerUser[0].payout).toBe(300);
    expect(response.body.data.getBestBetPerUser[1].payout).toBe(350);
  });
});
