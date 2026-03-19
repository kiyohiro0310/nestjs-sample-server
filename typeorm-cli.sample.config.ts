import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'a1b2c3d4e5A',
  database: 'nestjs-blog',
  entities: ['**/*.entity.js'],
  migrations: ['migrations/*.js'],
})