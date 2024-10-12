import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../src/user/user.model';
import { v4 as uuid } from 'uuid';
import { Bet } from '../src/bet/bet.model';

describe('UserResolver (e2e)', () => {
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

  it('should return an array of users', async () => {
    const users = [
      { id: 1, name: 'John Doe', balance: 1000 },
      { id: 2, name: 'Jane Doe', balance: 2000 },
    ];

    await User.bulkCreate(users);

    const query = `
      query {
        getUserList {
          id
          name
          balance
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.body.data.getUserList).toHaveLength(2);
    expect(response.body.data.getUserList).toMatchObject(
      users.map((user) => ({ ...user, id: user.id.toString() })),
    );
  });

  it('should return a single user', async () => {
    await User.create({ id: 1, name: 'John Doe', balance: 1000 });

    const query = `
      query {
        getUser(id: 1) {
          id
          name
          balance
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.body.data.getUser).toBeDefined();
    expect(response.body.data.getUser.id).toBe('1');
  });

  it('should return an error if user is not found', async () => {
    const query = `
      query {
        getUser(id: 999) {
          id
          name
          balance
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('User not found');
  });
});
