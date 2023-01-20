import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // CHECK IF YOU GET WHAT IS EXPECTED
        console.log('ENV VAR', configService.get('DATABASE_URL'));

        const options: MongooseModuleOptions = {
          uri: configService.get<string>('DATABASE_URL'),
        };

        return options;
      },
    }),
    ConfigModule.forRoot({
      cache: true,
    }),
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
