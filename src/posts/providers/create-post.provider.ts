import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDTO } from '../dtos/create-post.dto';
import type { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { Tag } from 'src/tags/tag.entity';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}
  public async createPost(post: CreatePostDTO, activeUser: ActiveUserData) {
    let user: User | undefined = undefined;
    let tags: Tag[] | undefined = undefined;

    try {
      user = await this.usersService.findOneById(activeUser.sub)
      if (!user) {
        throw new UnauthorizedException();
      }

      // Find tags
      tags = await this.tagsService.findMultipleTags(post.tags);

      if (user == null) throw new NotFoundException('User not found');
    } catch (error) {
      throw new ConflictException(error);
    }

    if (post.tags?.length !== tags.length)
      throw new BadRequestException('Please check your tag Ids');

    if (!user) throw new BadRequestException();

    // Create post
    const newPost = this.postsRepository.create({
      ...post,
      author: user,
      tags,
    });

    try {
      return await this.postsRepository.save(newPost);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }
}
