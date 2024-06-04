import {
  projectStatuses,
  taskPriorities,
  taskStatuses,
  userRoles,
} from "@/lib/data";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import * as my from "drizzle-orm/mysql-core";
import { generateId } from "lucia";

export const users = my.mysqlTable("user", {
  id: my.varchar("id", { length: 255 }).notNull().primaryKey(),
  name: my.varchar("name", { length: 255 }).notNull().unique(),
  role: my.mysqlEnum("role", userRoles).notNull().default("dev"),

  avatarImageID: my.varchar("avatar_image_id", { length: 255 }),
});

export const oauthAccounts = my.mysqlTable(
  "oauth_account",
  {
    providerType: my
      .mysqlEnum("provider_type", ["github", "discord"])
      .notNull(),
    providerUserID: my.varchar("provider_user_id", { length: 255 }).notNull(),
    userID: my
      .varchar("user_id", { length: 255 })
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
  userID: my
    .varchar("user_id", { length: 255 })
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
  userId: my
    .varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  expiresAt: my.datetime("expires_at").notNull(),
});

export const projects = my.mysqlTable("project", {
  id: my
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$default(() => generateId(50)),

  managerID: my
    .varchar("manager_id", { length: 255 })
    .notNull()
    .references(() => users.id),

  name: my.varchar("name", { length: 255 }).notNull(),
  description: my.varchar("description", { length: 1024 }).notNull(),

  status: my.mysqlEnum("status", projectStatuses).default("backlog").notNull(),

  createdAt: my
    .datetime("createdAt", { mode: "date" })
    .notNull()
    .default(sql`(now())`),
  updatedAt: my
    .datetime("updated_at", { mode: "date" })
    .notNull()
    .default(sql`(now())`)
    .$onUpdate(() => new Date()),
});

export const projectRelations = relations(projects, ({ one, many }) => ({
  manager: one(users, {
    fields: [projects.managerID],
    references: [users.id],
  }),
  projectsToDevs: many(projectsToDevs),
}));

export const projectsToDevs = my.mysqlTable(
  "project_to_dev",
  {
    projectID: my
      .varchar("project_id", { length: 255 })
      .notNull()
      .references(() => projects.id),
    devID: my
      .varchar("dev_id", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  t => ({
    pk: my.primaryKey({ columns: [t.projectID, t.devID] }),
  }),
);

export const projectToDevRelations = relations(projectsToDevs, ({ one }) => ({
  project: one(projects, {
    fields: [projectsToDevs.projectID],
    references: [projects.id],
  }),
  dev: one(users, {
    fields: [projectsToDevs.devID],
    references: [users.id],
  }),
}));

export const tasks = my.mysqlTable("task", {
  id: my
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$default(() => generateId(50)),

  projectID: my
    .varchar("project_id", { length: 255 })
    .notNull()
    .references(() => projects.id),

  devID: my
    .varchar("dev_id", { length: 255 })
    .notNull()
    .references(() => users.id),

  name: my.varchar("name", { length: 255 }).notNull(),
  description: my.varchar("description", { length: 1024 }).notNull(),

  status: my.mysqlEnum("status", taskStatuses).default("backlog").notNull(),
  priority: my.mysqlEnum("priority", taskPriorities).default("low").notNull(),

  createdAt: my
    .datetime("createdAt", { mode: "date" })
    .notNull()
    .default(sql`(now())`),
  updatedAt: my
    .datetime("updated_at", { mode: "date" })
    .notNull()
    .default(sql`(now())`)
    .$onUpdate(() => new Date()),
});

export const taskRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectID],
    references: [projects.id],
  }),
  dev: one(users, {
    fields: [tasks.devID],
    references: [users.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type Project = InferSelectModel<typeof projects>;
export type Task = InferSelectModel<typeof tasks>;
