import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export async function dropDatabase(config: ConfigService): Promise<void> {
  // Create the connection database
  const AppDataSource = await new DataSource({
    type: 'postgres',
    synchronize: config.get('database.syncronize'),
    port: config.get<number>('database.port'),
    username: config.get<string>('database.user'),
    host: config.get<string>('database.host'),
    database: config.get<string>('database.name'),
  }).initialize();
  
  // Drop all tables
  await AppDataSource.dropDatabase();

  // close the connection
  await AppDataSource.destroy();
}
