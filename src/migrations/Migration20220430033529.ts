import { Migration } from '@mikro-orm/migrations';

export class Migration20220430033529 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null, "email" varchar(255) not null, "password" varchar(255) not null, "full_name" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');

    this.addSql('create table "refresh_token" ("id" uuid not null, "user_id" uuid not null, "token" varchar(255) not null, "expires" timestamptz(0) not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "refresh_token" add constraint "refresh_token_pkey" primary key ("id");');

    this.addSql('alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

}
