import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { BookService } from './book.service';
import { Book, BookSchema } from './entities/book.entity';
import * as Chance from 'chance';
import { CreateBookInput } from './dto/create-book.input';
import { Schema as MongooSchema } from 'mongoose';
import { UpdateBookInput } from './dto/update-book.input';
import { AuthorService } from '../author/author.service';
import { AuthorModule } from '../author/author.module';
import { Author, AuthorSchema } from '../author/entities/author.entity';
import { createAuthorInput } from '../author/author.service.spec';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { createUserInput } from '../user/user.service.spec';
import { CANNOT_PURCHASE_MORE_THAN_ONE_COPY_EXCEPTION } from '../common/exceptions/user.exceptions';

const chance = new Chance();
let bookId = '';
let author: Author;

const UPDATED_DESCRIPTION_LENGTH = 25;
const DESCRIPTION_LENGTH = 20;

const createBookInput: CreateBookInput = {
  author: new MongooSchema.Types.ObjectId(''),
  coverImage: chance.url(),
  description: chance.string({ length: DESCRIPTION_LENGTH }),
  isbn: chance.string(),
  price: 12.09,
  title: chance.string({ length: 10 }),
};

const updateBookInput: UpdateBookInput = {
  _id: new MongooSchema.Types.ObjectId(''),
  coverImage: chance.url(),
  price: 20.99,
  description: chance.string({ length: UPDATED_DESCRIPTION_LENGTH }),
};

describe('BookService', () => {
  let service: BookService;
  let authorService: AuthorService;
  let userService: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [BookService, AuthorService, AuthorModule],
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot(),
        AuthorModule,
        UserModule,
        MongooseModule.forFeature([
          {
            name: Book.name,
            schema: BookSchema,
          },
          {
            name: Author.name,
            schema: AuthorSchema,
          },
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    authorService = module.get<AuthorService>(AuthorService);
    userService = module.get<UserService>(UserService);
    // We first create a new author, otherwise it will throw an error by using the generated one
    author = await authorService.create(createAuthorInput);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should create a new book', async () => {
    const book = await service.createBook({
      ...createBookInput,
      author: author._id,
    });

    expect(book).toBeDefined();
    expect(book.title).toBe(createBookInput.title);
    expect(book.description.length).toBe(DESCRIPTION_LENGTH);

    bookId = book.id;
    updateBookInput._id = book._id;
  });

  it('should get the list of books paginated with author populated', async () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    const { limit, skip } = paginationQuery;
    const response = await service.findAllBooks(limit, skip);

    // booksCount field
    expect(response.booksCount).toBeLessThanOrEqual(limit);
    expect(response.booksCount).toBe(1);

    // books fields
    expect(response.books.length).toBeLessThanOrEqual(limit);
    expect(response.books[0].author).toBeDefined();
    expect(response.books[0].title).toBe(createBookInput.title);

    // author field in a single book
    expect(response.books[0].author.name).toBe(createAuthorInput.name);

    // the readers field should return an empty array
    expect(response.books[0].readers.length).toBe(0);
  });

  it('should get the book by its id', async () => {
    // the additional params are the readerSkip and readersLimit params of the getBookById method
    const book = await service.getBookById(updateBookInput._id, 0, 10);
    expect(book.title).toBe(createBookInput.title);
    expect(book.id).toBe(bookId);
  });

  it('shoud update the a book by the updateBookInput', async () => {
    const updatedBook = await service.updateBook(
      updateBookInput._id,
      updateBookInput,
    );

    expect(updatedBook.price).not.toBe(createBookInput.price);
    expect(updatedBook.description.length).toBe(UPDATED_DESCRIPTION_LENGTH);
    expect(updatedBook.coverImage).toBe(updateBookInput.coverImage);
  });

  it('should remove a book', async () => {
    const deleted = service.removeBook(updateBookInput._id);
    expect(deleted).toBeDefined();
  });

  it('should receive not found error for getting the deleted user', async () => {
    try {
      await service.getBookById(updateBookInput._id, 0, 10);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });

  describe('User purchase features', () => {
    let user: User;
    beforeAll(async () => {
      // First we create a user who will purchase the book
      user = await userService.createUser(createUserInput);
    });

    it('should allow a user to buy one specific book, and be among readers for the book', async () => {
      const updatedBook: Book = await service.buyBook({
        bookId: updateBookInput._id,
        userId: user._id,
      });

      expect(updatedBook.readers.length).toBe(1);
      expect(updatedBook.readers[0].name).toBe(user.name);
    });

    it('should not allow a user to buy more than one copy of the same book', async () => {
      try {
        await service.buyBook({
          bookId: updateBookInput._id,
          userId: user._id,
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBeDefined();
        expect(error.message).toBe(
          CANNOT_PURCHASE_MORE_THAN_ONE_COPY_EXCEPTION,
        );
      }
    });

    it('should allow a user to buy more than one different books', async () => {
      const newBook = await service.createBook({
        ...createBookInput,
        author: author._id,
        isbn: '234ESJJ', // To avoid having the same isbn, violating a unique constraint we put in the schema
      });

      const updatedBook: Book = await service.buyBook({
        bookId: newBook._id,
        userId: user._id,
      });

      expect(updatedBook.readers.length).toBe(1);
      expect(updatedBook.readers[0].name).toBe(user.name);
    });
  });
});
