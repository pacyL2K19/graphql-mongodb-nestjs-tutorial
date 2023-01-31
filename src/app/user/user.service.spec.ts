/* eslint-disable prefer-const */
import { User, UserSchema } from './entities/user.entity';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Chance from 'chance';
import { CreateUserInput } from './dto/create-user.input';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { UpdateUserInput } from './dto/update-user.input';
import { Schema as MongooSchema } from 'mongoose';
import {
  ADDRESS_LENGTH,
  UPDATED_ADDRESS_LENGTH,
} from '../common/helpers/user.helper';

const chance = new Chance();
let userId = '';

export const createUserInput: CreateUserInput = {
  name: chance.name(),
  password: 'FakePassword1?',
  address: chance.string({ length: ADDRESS_LENGTH }),
  email: chance.email(),
};

export const updateUserInput: UpdateUserInput = {
  _id: new MongooSchema.Types.ObjectId(''),
  name: chance.name(),
  address: chance.string({ length: UPDATED_ADDRESS_LENGTH }),
};

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UserService, ConfigService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should create a user with createUserInput', async () => {
    const user = await service.createUser(createUserInput);
    expect(user.id).toBeDefined();
    expect(user.name).toBe(createUserInput.name);
    expect(user.address).toBe(createUserInput.address);
    expect(user.email).toBe(createUserInput.email);
    expect(user.password).not.toBeNull();
    updateUserInput._id = user._id;
    userId = user.id;
  });

  it('should get a list of users', async () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    const users = await service.findAll(
      paginationQuery.skip,
      paginationQuery.limit,
    );
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(1);
    expect(users[0].name).toBe(createUserInput.name);
    expect(users[0].address).toBe(createUserInput.address);
    expect(users[0].email).toBe(createUserInput.email);
    expect(users[0].password).not.toBeNull();
  });

  it('should get the user by its email address', async () => {
    const user = await service.findOneByEmail(createUserInput.email);
    expect(user.id).toBe(userId);
  });

  it('should update some user properties', async () => {
    const updatedUser = await service.updateUser(
      updateUserInput._id,
      updateUserInput,
    );

    expect(updatedUser.id).toBe(userId);
    expect(updatedUser.name).not.toBe(createUserInput.name);
    expect(updatedUser.address.length).toBe(UPDATED_ADDRESS_LENGTH);

    // the fields we didn't change must remain the same
    expect(updatedUser.email).toBe(createUserInput.email);
  });

  it('should delete the testing user', async () => {
    const deletedUser = await service.remove(updateUserInput._id);
    expect(deletedUser).toBeDefined();
  });

  it('should receive not found error for getting the deleted user', async () => {
    try {
      await service.getUserById(updateUserInput._id);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });

  it('should not be able to update an non existing user', async () => {
    try {
      await service.updateUser(updateUserInput._id, updateUserInput);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });
});
