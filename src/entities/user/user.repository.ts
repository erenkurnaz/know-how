import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { BaseRepository } from '../base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {}
