import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDTO } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

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
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

    // Find the Post
    const post = await this.postsRepository.findOneBy({ id: patchPostDto.id });

    if (post == null) return;
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
    return await this.postsRepository.save(post);
  }
}
