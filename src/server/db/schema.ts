// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pg.pgTableCreator(
  (name) => `glitch-guardian_${name}`,
);

export const posts = createTable(
  "post",
  {
    id: pg.serial("id").primaryKey(),
    name: pg.varchar("name", { length: 256 }),
    createdAt: pg
      .timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: pg.timestamp("updatedAt"),
  },
  (example) => ({
    nameIndex: pg.index("name_idx").on(example.name),
  }),
);

export const users = createTable("user", {
  id: pg.text("id").primaryKey(),
  githubID: pg.integer("github_id").notNull(),
  name: pg.varchar("name", { length: 256 }).notNull(),
});

export const sessions = createTable("session", {
  id: pg.text("id").primaryKey(),
  userId: pg
    .text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: pg
    .timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    })
    .notNull(),
});
