import { IntersectionType } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetPostBaseDTO {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetPostsDTO extends IntersectionType(
  GetPostBaseDTO,
  PaginationQueryDTO,
) {}
