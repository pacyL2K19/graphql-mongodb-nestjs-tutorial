import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import {
  CODE_STATUSES,
  GRAPHQL_ENDPOINT,
} from '../src/app/common/helpers/graphql.helper';
import {
  CREATE_USER_MUTATION,
  CREATE_USER_OPERATION_NAME,
  generateCreateUserVariables,
  generateUpdateUserVariables,
  GET_USERS_OP_NAME,
  GET_USERS_QUERY,
  UPDATED_ADDRESS_LENGTH,
  UPDATE_USER_MUTATION,
  UPDATE_USER_OPERATION_NAME,
} from '../src/app/common/helpers/user.helper';
import { User } from '../src/app/user/entities/user.entity';

jest.setTimeout(70000);

describe('User resolver (e2e)', () => {
  let app: INestApplication;
  let user: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Should create a user with user mutation', () => {
    const createUserInput = generateCreateUserVariables().createUserInput;
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: CREATE_USER_OPERATION_NAME,
        query: CREATE_USER_MUTATION,
        variables: { createUserInput },
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data.createUser).toBeDefined();
        user = res.body.data.createUser;
        expect(user._id).toBeDefined();
        expect(user.name).toBe(createUserInput.name);
        expect(user.email).toBe(createUserInput.email);
        expect(user.address).toBe(createUserInput.address);
      });
  });

  it('Should updart a user with the update user mutation', () => {
    const updateUserInput = generateUpdateUserVariables().updateUserInput;
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: UPDATE_USER_OPERATION_NAME,
        query: UPDATE_USER_MUTATION,
        variables: { updateUserInput: { ...updateUserInput, _id: user._id } },
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data.updateUser).toBeDefined();
        user = res.body.data.updateUser;
        expect(user._id).toBeDefined();
        expect(user.name).toBe(updateUserInput.name);
        expect(user.address).toBe(updateUserInput.address);
        expect(user.address.length).toBe(UPDATED_ADDRESS_LENGTH);
      });
  });

  it('should get a list of user', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: GET_USERS_OP_NAME,
        query: GET_USERS_QUERY,
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(Array.isArray(res.body.data.users)).toBe(true);
      });
  });
});
