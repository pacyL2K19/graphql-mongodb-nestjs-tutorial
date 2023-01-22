import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema } from 'mongoose';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author, AuthorDocument } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name)
    private authorModel: Model<AuthorDocument>,
  ) {}

  create(createAuthorInput: CreateAuthorInput) {
    const createdAuthor = new this.authorModel(createAuthorInput);
    return createdAuthor.save();
  }

  async findAll(limit: number, skip: number) {
    const authorsCount = await this.authorModel.find().countDocuments();
    const authors = await this.authorModel.find().skip(skip).limit(limit);

    return {
      authors,
      authorsCount,
    };
  }

  findAuthorById(id: MongooSchema.Types.ObjectId) {
    return this.authorModel.findById(id).populate('books');
  }

  updateAuthor(
    id: MongooSchema.Types.ObjectId,
    updateAuthorInput: UpdateAuthorInput,
  ) {
    return this.authorModel.findOneAndUpdate(updateAuthorInput);
  }

  remove(id: MongooSchema.Types.ObjectId) {
    return this.authorModel.deleteOne({ _id: id });
  }
}
