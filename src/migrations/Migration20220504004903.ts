import { Migration } from '@mikro-orm/migrations';

export class Migration20220504004903 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tag" ("id" uuid not null, "created_at" timestamptz(0) not null default \'now()\', "updated_at" timestamptz(0) null, "name" varchar(255) not null);',
    );
    this.addSql(
      'alter table "tag" add constraint "tag_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "user_favorite_tags" ("user_id" uuid not null, "tag_id" uuid not null);',
    );
    this.addSql(
      'alter table "user_favorite_tags" add constraint "user_favorite_tags_pkey" primary key ("user_id", "tag_id");',
    );

    this.addSql(
      'create table "post_tags" ("post_id" uuid not null, "tag_id" uuid not null);',
    );
    this.addSql(
      'alter table "post_tags" add constraint "post_tags_pkey" primary key ("post_id", "tag_id");',
    );

    this.addSql(
      'alter table "user_favorite_tags" add constraint "user_favorite_tags_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_favorite_tags" add constraint "user_favorite_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "post_tags" add constraint "post_tags_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "post_tags" add constraint "post_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "user" alter column "created_at" set default \'now()\';',
    );

    this.addSql(
      'alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "post" alter column "created_at" set default \'now()\';',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user_favorite_tags" drop constraint "user_favorite_tags_tag_id_foreign";',
    );

    this.addSql(
      'alter table "post_tags" drop constraint "post_tags_tag_id_foreign";',
    );

    this.addSql('alter table "user" alter column "created_at" drop default;');
    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );

    this.addSql('alter table "post" alter column "created_at" drop default;');
    this.addSql(
      'alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
  }
}
