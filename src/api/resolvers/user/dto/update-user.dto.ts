import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '@entities/user';

@InputType()
export class UpdateUserInput
  implements
    Omit<
      User,
      'password' | 'id' | 'updatedAt' | 'createdAt' | 'posts' | 'refreshTokens'
    >
{
  @Field()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ nullable: true })
  github?: string;

  @Field({ nullable: true })
  instagram?: string;

  @Field({ nullable: true })
  linkedin?: string;

  @Field({ nullable: true })
  twitter?: string;
}
