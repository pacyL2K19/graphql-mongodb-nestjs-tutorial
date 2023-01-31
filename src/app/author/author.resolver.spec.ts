import { Test, TestingModule } from '@nestjs/testing';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';
import { Schema as MongooSchema } from 'mongoose';
import * as Chance from 'chance';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';

const chance = new Chance();
let authorId = new MongooSchema.Types.ObjectId('');

export const createAuthorInput: CreateAuthorInput = {
  name: chance.string({ length: 10 }),
};

const updateAuthorInput: UpdateAuthorInput = {
  _id: new MongooSchema.Types.ObjectId(''),
  name: chance.string({ length: 12 }),
};
describe('AuthorResolver', () => {
  let resolver: AuthorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorResolver,
        {
          provide: AuthorService,
          useValue: {
            create: jest.fn(() => {
              return {
                _id: authorId,
                ...createAuthorInput,
              };
            }),
            findAll: jest.fn(() => {
              return {
                authors: [
                  {
                    _id: authorId,
                    ...createAuthorInput,
                  },
                ],
                authorsCount: 1,
              };
            }),
            findAuthorById: jest.fn(() => {
              return {
                _id: authorId,
                ...createAuthorInput,
              };
            }),
            updateAuthor: jest.fn(() => {
              return {
                _id: authorId,
                ...createAuthorInput,
                ...updateAuthorInput,
              };
            }),
            remove: jest.fn(() => {
              return {};
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthorResolver>(AuthorResolver);
  });

  it('should be able to create an author', async () => {
    const author = await resolver.createAuthor(createAuthorInput);

    expect(author.name).toBe(createAuthorInput.name);
    expect(author._id).toBeDefined();

    authorId = author._id;
  });

  it('should get a list of authors paginated', async () => {
    const response = await resolver.findAll({ limit: 10, skip: 0 });

    expect(response.authors[0].name).toBe(createAuthorInput.name);
    expect(response.authorsCount).toBe(1);
    expect(response.authors.length).toBe(1);
  });

  it('should update an author using the updateAuthorInput', async () => {
    const updatedAuthor = await resolver.updateAuthor(updateAuthorInput);

    expect(updatedAuthor.name).not.toBe(createAuthorInput.name);
    expect(updatedAuthor.name).toBe(updateAuthorInput.name);
  });

  it('should remove an author by his id', async () => {
    const removed = await resolver.removeAuthor(authorId);

    expect(removed).toBeDefined();
  });

  it('should throw an error when getting a removed author', async () => {
    try {
      await resolver.findAuthorById(authorId);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.response).toBeDefined();
      expect(error.response.statusCode).toBe(404);
    }
  });
});
