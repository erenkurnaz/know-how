import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '@database/user';

@InputType()
export class UpdateUserInput
  implements
    Pick<
      User,
      'fullName' | 'email' | 'github' | 'instagram' | 'linkedin' | 'twitter'
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
