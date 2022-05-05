import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { BaseRepository } from '../base.repository';

@Injectable()
export class PostRepository extends BaseRepository<Post> {}
