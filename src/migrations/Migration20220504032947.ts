import { Migration } from '@mikro-orm/migrations';

export class Migration20220504032947 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "tag" add constraint "tag_name_unique" unique ("name");',
    );

    this.addSql(
      'create index "post_content_title_index" on "post" ("content","title");;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "tag" drop constraint "tag_name_unique";');
    this.addSql('drop index "post_content_title_index";');
  }
}
