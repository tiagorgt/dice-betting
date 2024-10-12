import { UserService } from './user.service';
import * as SequelizeMock from 'sequelize-mock';

describe('UserService', () => {
  let service: UserService;
  let userMock: any;

  beforeEach(() => {
    const dbMock = new SequelizeMock();

    userMock = dbMock.define('User', {
      id: 1,
      name: 'John Doe',
      balance: 1000,
    });

    userMock.findByPk = jest.fn();

    service = new UserService(userMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [userMock.build()];
      jest.spyOn(userMock, 'findAll').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = userMock.build();
      console.log(JSON.stringify(result));
      jest.spyOn(userMock, 'findByPk').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });
  });
});
