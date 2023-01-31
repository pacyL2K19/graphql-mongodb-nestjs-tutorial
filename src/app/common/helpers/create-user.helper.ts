import * as Chance from 'chance';
const chance = new Chance();

export const CREATE_USER_OPERATION_NAME = 'CreateUser';
const UPDATED_ADDRESS_LENGTH = 15;
const ADDRESS_LENGTH = 20;

export const CREATE_USER_MUTATION = `mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    _id
    address
    email
    name
    password
  }
}`;

export const generateCreateUserVariables = () => {
  return {
    createUserInput: {
      name: chance.name(),
      password: 'FakePassword1?',
      address: chance.string({ length: ADDRESS_LENGTH }),
      email: chance.email(),
    },
  };
};
