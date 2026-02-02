import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateMetaOptionsDTO {
  @IsNotEmpty()
  @IsJSON()
  metaValue: JSON;
}
