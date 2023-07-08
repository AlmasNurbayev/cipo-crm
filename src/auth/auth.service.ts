import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from './dto/token.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService, private jwtService: JwtService) { }

 
  async login(dto:AuthDto): Promise<TokenDTO> {
    const {email, password} = dto;

    const user = await this.databaseService.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password or login');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ email: user.email }),
    };
  }



}
