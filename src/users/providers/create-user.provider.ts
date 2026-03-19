import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hasingProvider: HashingProvider,

    private readonly mailService: MailService,
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
      throw new BadRequestException(error);
    }

    if (existingUser) {
      throw new BadRequestException(
        'User alreay exists, please try another email.',
      );
    }
    // Create a new user
    let newUser = this.usersRepository.create({
      ...createUserDTO,
      password: await this.hasingProvider.hashPassword(createUserDTO.password)
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException(error);
    }

    try {
      await this.mailService.sendUserWelcome(newUser);
    }
    catch(error) {
      throw new RequestTimeoutException(error);
    }

    return newUser;
  }
}
