import { Injectable } from '@nestjs/common';
import { LoginUserInput } from '../user/dto/login-user.input';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(credentials: LoginUserInput) {
    const { password, email } = credentials;
    const user = await this.userService.findOne(email);

    const isMatch = await bcrypt.compare(password, user?.password);

    if (user && isMatch) {
      return user;
    }

    return null;
  }

  login(user: User) {
    return {
      user,
      authToken: this.jwtService.sign({
        email: user.email,
        name: user.name,
        sub: user._id,
      }),
    };
  }
}
