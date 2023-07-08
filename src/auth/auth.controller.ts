import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenDTO } from './dto/token.dto';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}
  
  @ApiOperation({summary: 'auth and get JWT token'})
  @ApiResponse ({status: 200, type: TokenDTO})
  @ApiBody({ type: AuthDto})
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
      return this.AuthService.login(dto);
  }
}
