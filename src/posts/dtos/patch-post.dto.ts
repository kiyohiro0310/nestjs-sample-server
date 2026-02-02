import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDTO } from './create-post.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchPostDTO extends PartialType(CreatePostDTO) {
  @ApiProperty({
    description: 'The ID of the post that needs to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
