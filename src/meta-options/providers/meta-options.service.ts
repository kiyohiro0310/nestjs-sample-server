import { Injectable } from '@nestjs/common';
import { CreateMetaOptionsDTO } from '../dtos/create-post-meta-options.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private optionRepository: Repository<MetaOption>,
  ) {}
  public async createMetaOption(option: CreateMetaOptionsDTO) {
    const newOption = this.optionRepository.create(option);
    return await this.optionRepository.save(newOption);
  }
}
