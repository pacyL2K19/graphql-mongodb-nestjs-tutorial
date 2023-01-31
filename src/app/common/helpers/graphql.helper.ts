export const GRAPHQL_ENDPOINT = '/graphql';
export const HELL0_WORLD = 'Hello World!';

export const GET_HELLO_OPERATION_NAME = 'Query';

export const GET_HELLO = `query Query {
  getHello
}`;

export enum CODE_STATUSES {
  OK = 200,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
}
