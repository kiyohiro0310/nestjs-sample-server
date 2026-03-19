import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { Post } from '../post.entity';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { CreatePostProvider } from './create-post.provider';
import { TagsService } from 'src/tags/tags.service';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const mockCreatePostProvider: Partial<CreatePostProvider> = {
      createPost: (post: CreatePostDTO, activeUser: ActiveUserData) =>
        Promise.resolve<Post>({
          title: post.title,
          postType: post.postType,
          slug: post.slug,
          status: post.status,
          content: post.content,
          author: {
            id: 12,
            firstName: 'Kiyo',
            lastName: 'Kamb',
            email: 'test@test.com',
          },
          tags: [],
        }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: CreatePostProvider,
          useValue: mockCreatePostProvider,
        },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {},
        },
        {
          provide: PaginationProvider,
          useValue: {},
        },
        {
          provide: TagsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('Should be defined', () => {
    expect(service.createPost).toBeDefined();
  });

  describe('createPost', () => {
    it('should call createPost on CreatePostProvider', async () => {
      const user: ActiveUserData = {
        sub: 12,
        email: 'test@test.com',
      };
      let post = await service.createPost(
        {
          title: 'Harry Potter',
          postType: postType.PAGE,
          slug: 'harry-potter-scene-1',
          status: postStatus.DRAFT,
          content: 'Sample',
        },
        user,
      );
      expect(post.title).toEqual('Harry Potter');
    },);
  });
});
