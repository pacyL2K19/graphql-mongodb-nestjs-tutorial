import { Injectable } from '@nestjs/common';
import { HELL0_WORLD } from './common/helpers/graphql.helper';

@Injectable()
export class AppService {
  getHello(): string {
    return HELL0_WORLD;
  }
}
