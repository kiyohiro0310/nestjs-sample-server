import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDTO } from './dtos/create-post.dto';
import { PatchPostDTO } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }
  @Get('/:userId')
  public getPostsById(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @ApiOperation({
    summary: 'Create a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'Get 201 if post successfully',
  })
  @Post()
  public createPost(@Body() req: CreatePostDTO) {
    return this.postsService.createPost(req);
  }

  @ApiOperation({
    summary: 'Update a new blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'Get 200 if update successfully',
  })
  @Patch()
  public updatePost(@Body() patchPostsDto: PatchPostDTO) {
    console.log(patchPostsDto);
    return 'Update successfully.';
  }
}
