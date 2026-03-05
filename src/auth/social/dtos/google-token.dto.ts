import { IsNotEmpty } from 'class-validator';

export class GoogleTokenDTO {
  @IsNotEmpty()
  token: string;
}