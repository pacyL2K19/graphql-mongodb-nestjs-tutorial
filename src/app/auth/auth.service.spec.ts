import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AuthService, ConfigService, UserService, JwtService],
      imports: [
        UserModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'testSecret',
          signOptions: {
            expiresIn: '24h',
          },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
