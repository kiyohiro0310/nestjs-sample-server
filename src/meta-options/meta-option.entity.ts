import { IsOptional } from 'class-validator';
import { Post } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  @IsOptional()
  id?: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: JSON;

  @CreateDateColumn()
  @IsOptional()
  createDate?: Date;

  @UpdateDateColumn()
  @IsOptional()
  updateDate?: Date;

  @OneToOne(() => Post, (post) => post.metaOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Post;
}
