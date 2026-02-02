import { IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
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
}
