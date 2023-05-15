import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './app/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
      cache: 'bounded',
      path: `api/v2/graphql`,
    }),
    ConfigModule.forRoot({
      cache: true,
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const options: MongooseModuleOptions = {
    //       uri: configService.get<string>('DATABASE_URL'),
    //     };

    //     return options;
    //   },
    // }),
    AuthModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
