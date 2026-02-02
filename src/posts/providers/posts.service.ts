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

  public async findAll() {
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
      },
    });

    return posts;
  }

  public async findUserPost(userId: number) {
    const posts = await this.postsRepository.find({
      where: {
        id: userId,
      },
      relations: {
        metaOptions: true,
      },
    });
    return posts;
  }

  public async createPost(post: CreatePostDTO) {
    // Find authro from database based on author id
    const user = await this.usersService.findOneById(Number(post.authorId));

    if (user == null) return 'User not found';

    // Create post
    const newPost = this.postsRepository.create({ ...post, author: user });

    // return the post
    return await this.postsRepository.save(newPost);
  }

  public async deletePost(id: number) {
    await this.postsRepository.delete(id);
    return { delted: true, id };
  }
}
