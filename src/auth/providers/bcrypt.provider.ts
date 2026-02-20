import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { log } from 'console';

@Injectable()
export class BcryptProvider implements HashingProvider {
  hashPassword(data: string | Buffer): Promise<string> {
    log(data);
    throw new Error('Error');
  }
  comparePassword(
    data: string | Buffer,
    encrypted: string | Buffer,
  ): Promise<boolean> {
    log(data, encrypted);
    throw new Error('Error');
  }
}
