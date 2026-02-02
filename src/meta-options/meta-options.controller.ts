import { Body, Controller, Post } from '@nestjs/common';
import { CreateMetaOptionsDTO } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly moService: MetaOptionsService) {}
  @Post()
  public CreateMetaOption(@Body() req: CreateMetaOptionsDTO) {
    return this.moService.createMetaOption(req);
  }
}
