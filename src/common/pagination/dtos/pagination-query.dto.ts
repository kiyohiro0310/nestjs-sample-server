import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDTO {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  page: number = 1;
}
