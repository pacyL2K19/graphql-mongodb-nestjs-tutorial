import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { Author, AuthorSchema } from './entities/author.entity';

@Module({
  providers: [AuthorsResolver, AuthorsService],
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: MongooseModuleOptions = {
          uri: configService.get<string>('DATABASE_URL'),
        };

        return options;
      },
    }),
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
    ConfigModule.forRoot({
      cache: true,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      path: `api/v2/graphql`,
    }),
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
  ],
})
export class AuthorsModule {}
