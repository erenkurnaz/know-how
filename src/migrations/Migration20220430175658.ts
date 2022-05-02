import { Migration } from '@mikro-orm/migrations';

export class Migration20220430175658 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "github" varchar(255) null, add column "linkedin" varchar(255) null, add column "twitter" varchar(255) null, add column "instagram" varchar(255) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "github";');
    this.addSql('alter table "user" drop column "linkedin";');
    this.addSql('alter table "user" drop column "twitter";');
    this.addSql('alter table "user" drop column "instagram";');
  }
}
