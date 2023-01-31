import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import * as Chance from 'chance';
import { CreateUserInput } from './dto/create-user.input';
import { Schema as MongooSchema } from 'mongoose';
import { UpdateUserInput } from './dto/update-user.input';

const ADDRESS_LENGTH = 20;

let userId = new MongooSchema.Types.ObjectId('');
const chance = new Chance();

const createUserInput: CreateUserInput = {
  name: chance.name(),
  password: 'FakePassword1?',
  address: chance.string({ length: ADDRESS_LENGTH }),
  email: chance.email(),
};

const updateUserInput: UpdateUserInput = {
  _id: userId,
  name: chance.name(),
};

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
              };
            }),
            findAll: jest.fn(() => {
              return [
                {
                  _id: userId,
                  ...createUserInput,
                },
              ];
            }),
            getUserById: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
              };
            }),
            updateUser: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
                ...updateUserInput,
              };
            }),
            remove: jest.fn(() => {
              return {};
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be able to create a user', async () => {
    const user = await resolver.createUser(createUserInput);
    expect(user._id).toBeDefined();
    expect(user._id).toBe(userId);
    expect(user.name).toBe(createUserInput.name);
    expect(user.email).toBe(createUserInput.email);
    expect(user.address).toBe(createUserInput.address);
    userId = user._id;
    updateUserInput._id = user._id;
  });

  it('should be able to list all users', async () => {
    const users = await resolver.findAll();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users[0]._id).toBe(userId);
  });

  it('should be able to find one user by id', async () => {
    const user = await resolver.getUserById(userId);
    expect(user).toBeDefined();
    expect(user._id).toBe(userId);
  });

  it('should be able to update a user', async () => {
    const updated = await resolver.updateUser(updateUserInput);
    expect(updated._id).toBe(userId);
    expect(updated.name).toBe(updateUserInput.name);
  });

  it('should be able to test removeUser ', async () => {
    const removedUser = await resolver.removeUser(userId);
    expect(removedUser).toBeDefined();
  });
});
