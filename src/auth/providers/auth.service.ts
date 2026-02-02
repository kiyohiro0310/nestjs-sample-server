import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public async login(email: string, password: string, id: number) {
    // Check user exists database
    const user = await this.usersService.findOneById(id);
    if (!user) return;

    return 'sample-token-123#$%d';
    // login
    // token
  }

  public isAuth() {
    return true;
  }
}
