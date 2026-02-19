import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDTO } from '../dtos/create-many.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createUsersDTO: CreateManyUsersDTO) {
    const newUsers: User[] = [];
    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    // Connect Query Runner to data source
    await queryRunner.connect();

    // Start Transaction
    await queryRunner.startTransaction();
    try {
      for (const user of createUsersDTO.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }

    return newUsers;
  }
}
