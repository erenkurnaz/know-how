import { Injectable } from '@nestjs/common';
import { RefreshToken } from './refresh-token.entity';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {}
