import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Body } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { PostsModule } from 'src/posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

const user: CreateUserDto = {
  firstName: 'Nana',
  lastName: 'Kambayashi',
  email: 'nana@kiyo.com',
  password: 'Password123!',
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let config: ConfigService;
  let httpServer: App;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PostsModule, ConfigModule],
      providers: [ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();

    // Create user
    await request(httpServer).post('/users').send(user).expect(201);

    // Login with created user above
    const loginResponse = await request(httpServer)
      .post('/auth/sign-in')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);

    accessToken = loginResponse.body.data.accessToken;
  });

  it('/posts - should create post', async () => {
    return request(httpServer)
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Hi, Mourad!',
        postType: 'post',
        slug: 'new-with-nestjs-with-author-12',
        status: 'draft',
        content: 'test content',
        schema: '{"key": "passport", "value": "ty45343339"}',
        featuredImageUrl: 'http://localhost.com/images/image1.jpg',
        metaOptions: {
          metaValue: '{"key": "passport", "value": "ty45343339"}',
        },
        tags: []
      }).expect(201)
  });


  it('/posts/:userId - should return error without jwt', async () => {
    return request(httpServer).get('/posts/1').expect(401);
  });


  it('/posts/:userId - should find all specific user posts', async () => {
    const userId = '1';
    return request(httpServer)
      .get(`/posts/${userId}`)
      .query({
        limit: 5,
        page: 2,
        startDate: '2023-01-01'
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/posts/:userId - should not find user posts if query value is negative', async () => {
    const userId = '1';
    return request(httpServer)
      .get(`/posts/${userId}`)
      .query({
        limit: -5,
        page: 2,
        startDate: '2023-01-01'
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(500);
  });

  afterAll(async () => {
    await dropDatabase(config);
    await app.close();
  });
});
