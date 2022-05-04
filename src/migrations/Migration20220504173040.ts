import { Migration } from '@mikro-orm/migrations';

export class Migration20220504173040 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_followers" ("follower" uuid not null, "following" uuid not null);',
    );
    this.addSql(
      'alter table "user_followers" add constraint "user_followers_pkey" primary key ("follower", "following");',
    );

    this.addSql(
      'alter table "user_followers" add constraint "user_followers_follower_foreign" foreign key ("follower") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_followers" add constraint "user_followers_following_foreign" foreign key ("following") references "user" ("id") on update cascade on delete cascade;',
    );
  }
}
