import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * Constructor to use Auth methods. To avoid circular dependencies, apply forwardRef
   */
  constructor(
    // Injecting Auth service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(createUserDTO: CreateUserDto) {
    // Check user exists with same email
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDTO.email,
      },
    });

    // Handle exception
    if (existingUser) return;
    // Create a new user
    let newUser = this.usersRepository.create(createUserDTO);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }
  /**
   * Function to get all users
   */
  public findAll(req: GetUsersParamDto, limit: number, page: number) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    console.log(req, limit, page);
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      { fisrstName: 'Alice', email: 'alice@doe.com' },
    ];
  }
  /**
   * The method to get one user by ID
   */
  public findOneById(id: string) {
    return {
      id,
      firstName: 'sample',
      email: 'sample@test.com',
    };
  }
}
