import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreateMetaOptionsDTO } from '../../meta-options/dtos/create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDTO {
  @ApiProperty({
    description: 'This is the title for the blog post',
    example: 'This is a title',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  @Type(() => String)
  title: string;

  @ApiProperty({
    enum: postType,
    description: "Possible values, 'post', 'page', 'story', 'series'",
  })
  @IsNotEmpty()
  @IsEnum(postType)
  postType: postType;

  @ApiProperty({
    description: "For example - 'my-url'",
    example: 'my-blog-post',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and users only "-" and without spaces.',
  })
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: "Possible values 'draft', 'scheduled', 'review', 'published'",
  })
  @IsNotEmpty()
  @IsEnum(postStatus)
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This is the content of post',
    example: 'smaple',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Serialise JSON object',
    example: '{\r\n "@context": "https\/\/schema.org" \r\n}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image for your blog post',
    example: 'http://localhost:3000/image/image1.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Published date',
    example: '2016-01-01',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tags passed as string values',
    example: ['nestjs', 'sample', 'hello'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'The meta value is a json string',
          example: '{"sidebarEnabled": true }',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMetaOptionsDTO)
  metaOptions?: CreateMetaOptionsDTO | undefined;
}
