import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcyrpt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcyrpt.genSalt();
    return bcyrpt.hash(data, salt);
  }
  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcyrpt.compare(data, encrypted);
  }
}
