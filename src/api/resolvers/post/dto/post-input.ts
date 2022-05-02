import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Post } from '@entities/post';

@InputType()
export class PostInput implements Pick<Post, 'title' | 'content'> {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => [String])
  tagIds: string[];
}
