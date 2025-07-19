import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1752765947216 implements MigrationInterface {
    name = 'InitSchema1752765947216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "watchlist_item" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "mediaType" varchar NOT NULL, "year" integer NOT NULL, "primaryImageUrl" varchar NOT NULL, "jellyfinUserId" varchar NOT NULL, "addedOn" datetime NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "watchlist_item"`);
    }

}
