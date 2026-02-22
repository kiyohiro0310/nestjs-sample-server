import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDTO } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ){}

  public async signIn(signInDto: SignInDTO) {
    // Find the user using email ID
    // Throw an exception user not found
    // Compare password to the hash
    // Send confirmation
    
  }

  public isAuth() {
    return true;
  }
}
