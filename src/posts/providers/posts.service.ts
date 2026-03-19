import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDTO } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDTO } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { CreatePostProvider } from './create-post.provider';

@Injectable()
export class PostsService {
  constructor(
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  public async createPost(createPostDto: CreatePostDTO, user: ActiveUserData) {
    return await this.createPostProvider.createPost(createPostDto, user);
  }

  public async findAll() {
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
      },
    });

    return posts;
  }

  public async findUserPost(
    userId: string,
    postQuery: GetPostsDTO,
  ): Promise<Paginated<Post>> {
    const posts = await this.paginationProvider.pagenateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );

    return posts;
  }

  public async deletePost(id: number) {
    await this.postsRepository.delete(id);
    return { delted: true, id };
  }

  public async updatePost(patchPostDto: PatchPostDTO) {
    // Find the Tags
    let tags = null as Tag[] | null;
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.REQUEST_TIMEOUT,
          error: 'Request timed out',
        },
        HttpStatus.REQUEST_TIMEOUT,
        {
          description: 'Request timed out.',
        },
      );
    }

    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag IDs and ensure they are correct.',
      );
    }

    let post = null as Post | null;
    try {
      post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }

    if (!post)
      throw new NotFoundException('Post not found', {
        description: 'ID does not exist',
      });
    // Update the properties
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Assign the new tags
    post.tags = tags;

    // Save the post and return
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(error);
    }
    return post;
  }
}
