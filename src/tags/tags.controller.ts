import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTagDTO } from './dtos/create-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('/create')
  public createTag(@Body() req: CreateTagDTO) {
    return this.tagsService.createTag(req);
  }

  @Delete('delete')
  public delete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softRemove(id);
  }

  @Delete('soft-delete')
  public async softDeletePost(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softRemove(id);
  }
}
