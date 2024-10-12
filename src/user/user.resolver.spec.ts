import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import * as SequelizeMock from 'sequelize-mock';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;
  let userMock: any;

  beforeEach(() => {
    const dbMock = new SequelizeMock();

    userMock = dbMock.define('User', {
      id: 1,
      name: 'John Doe',
      balance: 1000,
    });

    service = new UserService(userMock);
    resolver = new UserResolver(service);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a single user', async () => {
      const result = userMock.build();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await resolver.getUser(1)).toBe(result);
    });
  });

  describe('getUserList', () => {
    it('should return an array of users', async () => {
      const result = [userMock.build()];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getUserList()).toBe(result);
    });
  });
});