import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDTO } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDTO } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'dist/common/pagination/interfaces/paginated.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly moRepository: Repository<MetaOption>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

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

  public async createPost(post: CreatePostDTO) {
    // Find authro from database based on author id
    const user = await this.usersService.findOneById(Number(post.authorId));

    // Find tags
    const tags = await this.tagsService.findMultipleTags(post.tags);

    if (user == null) return 'User not found';

    // Create post
    const newPost = this.postsRepository.create({
      ...post,
      author: user,
      tags,
    });

    // return the post
    return await this.postsRepository.save(newPost);
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
