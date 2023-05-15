import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { USER_ALREADY_EXIST_EXCEPTION } from '@app/common/exceptions';

// import { UserService } from 'apps/users/src/users.service';
import { User } from 'apps/users/src/entities/user.entity';
import { CreateUserInput } from 'apps/users/src/dto/create-user.input';

import { LoginUserInput } from './dto/login-user.input';

@Injectable()
export class AuthService {
  constructor(
    // private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginUserInput: LoginUserInput) {
    // const { email, password } = loginUserInput;
    // const user = await this.userService.findOneByEmail(email);

    // const isMatch = await bcrypt.compare(password, user?.password);

    // if (user && isMatch) {
    //   return user;
    // }

    return loginUserInput;
  }

  login(user: User) {
    return {
      user,
      authToken: this.jwtService.sign(
        {
          email: user.email,
          name: user.name,
          sub: user._id,
        },
        {
          secret:
            this.configService.get<string>('JWT_SECRET') || 'testingEnvSecret',
        },
      ),
    };
  }

  async signup(payload: CreateUserInput) {
    // CHECK IF THE USER ALREADY EXISTS
    // const user = await this.userService.findOneByEmail(payload.email);

    // if (user) {
    //   throw new Error(USER_ALREADY_EXIST_EXCEPTION);
    // }

    // GENERATE HASH PASSWORD TO SAVE
    const hash = await bcrypt.hash(
      payload.password,
      Number(this.configService.get<string>('SALT_ROUND') || '8'),
    );

    return { ...payload, hash };
  }
}
