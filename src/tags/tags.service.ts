import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { CreateTagDTO } from './dtos/create-tag.dto';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  public async createTag(tag: CreateTagDTO) {
    const newTag = this.tagRepository.create(tag);

    await this.tagRepository.save(newTag);

    return 'Create tag successfully';
  }

  public async findMultipleTags(tags: number[] | undefined) {
    const results = await this.tagRepository.find({
      where: {
        id: In(tags ? tags : []),
      },
    });

    return results;
  }

  public async delete(id: number) {
    await this.tagRepository.delete(id);

    return { deleted: true, id };
  }

  public async softRemove(id: number) {
    await this.tagRepository.softDelete(id);
  }
}
