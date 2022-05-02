import { Migration } from '@mikro-orm/migrations';

export class Migration20220501221059 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "post" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null, "title" varchar(255) not null, "content" varchar(255) not null, "owner_id" uuid not null);',
    );
    this.addSql(
      'alter table "post" add constraint "post_pkey" primary key ("id");',
    );

    this.addSql(
      'alter table "post" add constraint "post_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;',
    );
  }
}
