import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDTO } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokenProvider } from 'src/auth/providers/generate-token.provider';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDTO) {
    try {
      // Verify the Google token sent by User
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      console.log(loginTicket)

      // Extract the payload from Google JWT
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload()!;

      // Find the user in the database using the Google ID
      const user = await this.usersService.findOneByGoogleId(googleId);

      // If Google id exists generate token
      if (user) {
        return this.generateTokenProvider.generateToken(user);
      }

      // If not create a new user and then generate tokens
      const newUser = await this.usersService.createGoogleUser({
        firstName: firstName ?? 'Not Set',
        lastName: lastName ?? 'Not Set',
        email: email ?? 'Not Set',
        password: '',
        googleId,
      });

      return this.generateTokenProvider.generateToken(newUser);
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException(error);
    }
  }
}
