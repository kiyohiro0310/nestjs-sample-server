import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDTO } from './dtos/create-post.dto';
import { PatchPostDTO } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public getPosts() {
    return this.postsService.findAll();
  }
  @Get('/:userId')
  public getPostsById(@Param('userId', ParseIntPipe) userId: number) {
    return this.postsService.findUserPost(userId);
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
    return this.postsService.updatePost(patchPostsDto);
  }

  @Delete()
  public async deletePost(@Query('id', ParseIntPipe) id: number) {
    return await this.postsService.deletePost(id);
  }
}
