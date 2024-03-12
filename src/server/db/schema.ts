// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pg.pgTableCreator(name => `glitch-guardian_${name}`);

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
  example => ({
    nameIndex: pg.index("name_idx").on(example.name),
  }),
);

export const users = createTable("user", {
  id: pg.text("id").primaryKey(),
  name: pg.varchar("name", { length: 256 }).notNull(),
});

export const providerTypeEnum = pg.pgEnum("provider_type", ["github"]);

export const oauthAccounts = createTable(
  "oauth_account",
  {
    providerType: providerTypeEnum("provider_type"),
    providerUserID: pg.text("provider_user_id"),
    userID: pg
      .text("user_id")
      .notNull()
      .references(() => users.id),
  },
  table => ({
    pk: pg.primaryKey({ columns: [table.providerType, table.providerUserID] }),
  }),
);

export const oauthAccountRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userID],
    references: [users.id],
  }),
}));

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
