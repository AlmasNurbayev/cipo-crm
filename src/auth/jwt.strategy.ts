import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
//import { jwtSecret } from './auth.module';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private UserService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.jwtSecret,
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.UserService.findEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}