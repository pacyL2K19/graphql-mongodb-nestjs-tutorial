import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { AuthorService } from './author.service';
import { Author, AuthorSchema } from './entities/author.entity';
import { Schema as MongooSchema } from 'mongoose';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';

import * as Chance from 'chance';
import * as mongoose from 'mongoose';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';

const chance = new Chance();
let authorId = '';

export const createAuthorInput: CreateAuthorInput = {
  name: chance.string({ length: 10 }),
};

const updateAuthorInput: UpdateAuthorInput = {
  _id: new MongooSchema.Types.ObjectId(''),
  name: chance.string({ length: 12 }),
};

describe('AuthorService', () => {
  let service: AuthorService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AuthorService],
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
          {
            name: Author.name,
            schema: AuthorSchema,
          },
        ]),
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should create a new author with the CreateAuthorInput dto', async () => {
    const author = await service.create(createAuthorInput);

    expect(mongoose.isValidObjectId(author._id)).toBeTruthy();
    expect(author.name).not.toBeNull();
    expect(author.name).toBe(createAuthorInput.name);
    authorId = author.id;
    updateAuthorInput._id = author._id;
  });

  it('should update the authors name', async () => {
    const updatedAuthor = await service.updateAuthor(
      updateAuthorInput._id,
      updateAuthorInput,
    );

    expect(updatedAuthor.id).toBe(authorId);
    expect(updatedAuthor.name).not.toBe(createAuthorInput.name);
    expect(updatedAuthor.name).toBe(updateAuthorInput.name);
  });

  it('should get a list of authors', async () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    const { limit, skip } = paginationQuery;
    const authors = await service.findAll(limit, skip);

    expect(authors).toBeDefined();
    expect(Array.isArray(authors.authors)).toBe(true);
    expect(authors.authorsCount).toBe(1);
    expect(authors.authors.length).toBeLessThanOrEqual(limit);
    expect(authors.authors[0].name).toBe(updateAuthorInput.name);
    expect(authors.authors[0]._id).not.toBeNull();
  });

  it('should find an author by his id', async () => {
    const author = await service.findAuthorById(updateAuthorInput._id);
    expect(author.name).toBe(updateAuthorInput.name);
  });

  it('should delete an author', async () => {
    const deletedAuthor = await service.remove(updateAuthorInput._id);
    expect(deletedAuthor).toBeDefined();
  });

  it('should return an empty array of authors when getting all the authors', async () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    const { limit, skip } = paginationQuery;
    const authors = await service.findAll(limit, skip);

    expect(authors).toBeDefined();
    expect(authors.authorsCount).toBe(0);
  });
});
