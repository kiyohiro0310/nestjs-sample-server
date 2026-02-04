import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, type ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

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

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Injecting Config service
     */
    private readonly configService: ConfigService,
  ) {}

  public async createUser(createUserDTO: CreateUserDto) {
    let existingUser = null as User | null;

    try {
      existingUser = await this.usersRepository.findOne({
        where: {
          email: createUserDTO.email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    if (existingUser) {
      throw new BadRequestException(
        'User alreay exists, please try another email.',
      );
    }
    // Create a new user
    let newUser = null as User | null;

    try {
      newUser = this.usersRepository.create(createUserDTO);
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return newUser;
  }
  /**
   * Function to get all users
   */
  public findAll() {
    console.log(this.profileConfiguration);
    console.log(this.profileConfiguration.apiKey);
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
  public async findOneById(id: number) {
    let user = null as User | null;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
    return user;
  }
}
