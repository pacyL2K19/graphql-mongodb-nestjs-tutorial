import * as Chance from 'chance';
const chance = new Chance();

export const CREATE_USER_OPERATION_NAME = 'CreateUser';
export const UPDATE_USER_OPERATION_NAME = 'UpdateUser';
export const GET_USERS_OP_NAME = 'Users';
export const UPDATED_ADDRESS_LENGTH = 15;
export const ADDRESS_LENGTH = 20;

export const CREATE_USER_MUTATION = `mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    _id
    address
    email
    name
    password
  }
}`;

export const UPDATE_USER_MUTATION = `mutation UpdateUser($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) {
    _id
    name
    email
    password
    address
  }
}`;

export const GET_USERS_QUERY = `query Users {
  users {
    _id
    name
    email
    password
    address
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

export const generateUpdateUserVariables = () => {
  return {
    updateUserInput: {
      _id: '63cbecf35b3df4fbb1265edd',
      name: chance.name(),
      address: chance.string({ length: UPDATED_ADDRESS_LENGTH }),
    },
  };
};
