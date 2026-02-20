import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDTO } from '../dtos/create-many.dto';
import { QueryRunner } from 'typeorm/browser';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createUsersDTO: CreateManyUsersDTO) {
    const newUsers: User[] = [];
    let queryRunner = null as QueryRunner | null;

    try {
      queryRunner = this.dataSource.createQueryRunner();

      // Connect Query Runner to data source
      await queryRunner.connect();

      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to the database', {
        description: String(error),
      });
    }

    try {
      for (const user of createUsersDTO.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    return newUsers;
  }
}
