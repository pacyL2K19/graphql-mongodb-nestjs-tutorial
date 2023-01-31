import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Schema as MongooSchema } from 'mongoose';
import * as Chance from 'chance';
import { CreateUserInput } from '../user/dto/create-user.input';

const userId = new MongooSchema.Types.ObjectId('');
const chance = new Chance();

const signupUserInput: CreateUserInput = {
  address: chance.string({ length: 10 }),
  email: chance.email(),
  name: chance.string({ length: 12 }),
  password: 'NewPassword2!',
};
describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(() => {
              // shpuld return a user
              return {
                _id: userId,
                ...signupUserInput,
              };
            }),
            login: jest.fn(() => {
              return {
                user: {
                  _id: userId,
                  ...signupUserInput,
                },
                authToken:
                  'a-fake-token-as-we-tested-our-service-we-are-sure-we-get-it-from-the-service',
              };
            }),
            signup: jest.fn(() => {
              return {
                _id: userId,
                ...signupUserInput,
              };
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('create a new user', async () => {
    const user = await resolver.signup(signupUserInput);

    expect(user.name).toBe(signupUserInput.name);
    expect(user.email).toBe(signupUserInput.email);
  });

  it('should log in an existing user', async () => {
    const user = resolver.login(
      {
        email: signupUserInput.email,
        password: signupUserInput.password,
      },
      // the second argument is supposed to be a context, we are passing an empty object
      {},
    );

    expect(user.user.email).toBe(signupUserInput.email);
  });
});
