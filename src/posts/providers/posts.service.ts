import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly moRepository: Repository<MetaOption>,
  ) {}
  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      {
        user,
        title: 'Test Title',
        content: 'Test content',
      },
      {
        user,
        title: 'Test Title 2',
        content: 'Test content 2',
      },
    ];
  }

  public async createPost(post: CreatePostDTO) {
    // Create metaOptions
    const metaOptions = post.metaOptions
      ? this.moRepository.create(post.metaOptions)
      : undefined;

    if (metaOptions) {
      await this.moRepository.save(metaOptions);
    }

    // Create post
    const newPost = this.postsRepository.create(post);

    // Add meta options to the post'
    if (metaOptions) {
      newPost.metaOptions = metaOptions;
    }

    // return the post
    return await this.postsRepository.save(newPost);
  }
}
