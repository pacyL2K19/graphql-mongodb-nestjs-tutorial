import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: ApolloGatewayDriverConfig = {
          gateway: {
            supergraphSdl: new IntrospectAndCompose({
              subgraphs: [
                {
                  name: 'users',
                  url: configService.get<string>('USERS_SERVICE_URL'),
                },
                {
                  name: 'books',
                  url: configService.get<string>('BOOKS_SERVICE_URL'),
                },
                {
                  name: 'authors',
                  url: configService.get<string>('AUTHORS_SERVICE_URL'),
                },
                {
                  name: 'auth',
                  url: configService.get<string>('AUTH_SERVICE_URL'),
                },
              ],
            }),
          },
        };

        return options;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
