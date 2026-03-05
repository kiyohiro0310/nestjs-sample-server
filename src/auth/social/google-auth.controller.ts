import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthService } from './providers/google-auth.service';
import { GoogleTokenDTO } from './dtos/google-token.dto';
import { Auth } from '../decorator/auth.decorator';
import { AuthType } from '../enums/auth-type';

@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post()
  public authenticate(@Body() googleTokenDto: GoogleTokenDTO) {
    return this.googleAuthService.authenticate(googleTokenDto);
  }
}
