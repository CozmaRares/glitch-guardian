import { InferSelectModel, relations, sql } from "drizzle-orm";
import * as my from "drizzle-orm/mysql-core";

export const posts = my.mysqlTable(
  "post",
  {
    id: my.bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: my.varchar("name", { length: 256 }),
    createdAt: my
      .timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: my.timestamp("updatedAt").onUpdateNow(),
  },
  example => ({
    nameIndex: my.index("name_idx").on(example.name),
  }),
);

export const users = my.mysqlTable("user", {
  id: my.varchar("id", { length: 255 }).notNull().primaryKey(),
  name: my.varchar("name", { length: 255 }).notNull(),
  email: my.varchar("email", { length: 255 }).notNull().unique(),
  role: my.mysqlEnum("role", ["dev", "manager"]).notNull().default("dev"),
});

export type User = InferSelectModel<typeof users>;

export const oauthAccounts = my.mysqlTable(
  "oauth_account",
  {
    providerType: my
      .mysqlEnum("provider_type", ["github", "discord"])
      .notNull(),
    providerUserID: my.varchar("provider_user_id", { length: 255 }).notNull(),
    userID: my.varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  table => ({
    pk: my.primaryKey({
      columns: [table.providerType, table.providerUserID],
    }),
  }),
);

export const oauthAccountRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userID],
    references: [users.id],
  }),
}));

export const passwordAccounts = my.mysqlTable("password_account", {
  userID: my.varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  hashedPassword: my.varchar("hashed_password", { length: 255 }).notNull(),
});

export const passwordAccountRelations = relations(
  passwordAccounts,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordAccounts.userID],
      references: [users.id],
    }),
  }),
);

export const sessions = my.mysqlTable("session", {
  id: my.varchar("id", { length: 255 }).primaryKey(),
  userId: my.varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  expiresAt: my.datetime("expires_at").notNull(),
});
