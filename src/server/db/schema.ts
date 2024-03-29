// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type InferSelectModel, relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pg.pgTableCreator(name => `glitch-guardian_${name}`);

export const userRoleEnum = pg.pgEnum("user_role", [
  "admin",
  "manager",
  "developer",
  "tester",
]);

// TODO: add email
export const users = createTable("user", {
  id: pg.text("id").primaryKey(),
  name: pg.varchar("name", { length: 256 }).notNull().unique(),
  role: userRoleEnum("role").notNull().default("tester"),
});

export type User = InferSelectModel<typeof users>;

export const providerTypeEnum = pg.pgEnum("provider_type", [
  "github",
  "discord",
]);

export const oauthAccounts = createTable(
  "oauth_account",
  {
    providerType: providerTypeEnum("provider_type").notNull(),
    providerUserID: pg.text("provider_user_id").notNull(),
    userID: pg
      .text("user_id")
      .notNull()
      .references(() => users.id),
  },
  table => ({
    pk: pg.primaryKey({
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

export const passwordAccounts = createTable("password_account", {
  userID: pg
    .text("user_id")
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  hashedPassword: pg.text("hashed_password").notNull(),
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

export const sessions = createTable("session", {
  id: pg.text("id").notNull().primaryKey(),
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

export const projectStatusEnum = pg.pgEnum("project_status", [
  "active",
  "completed",
  "on hold",
  "maintenance",
]);

export const projects = createTable("project", {
  id: pg.serial("id").notNull().primaryKey(),

  name: pg.text("name").notNull().default(""),
  description: pg.text("description").notNull().default(""),

  startDate: pg.date("created_at").notNull().defaultNow(),
  endDate: pg.timestamp("updatedAt"),

  status: projectStatusEnum("status").notNull().default("active"),
});

export const projectRelations = relations(projects, ({ many }) => ({
  users: many(usersToProjects),
  bugs: many(bugs),
}));

export const userToProjectRelationTypeEnum = pg.pgEnum(
  "user_to_project_relation_type",
  ["manager", "developer", "tester"],
);

export const usersToProjects = createTable(
  "users_to_projects",
  {
    projectID: pg
      .serial("project_id")
      .notNull()
      .references(() => projects.id),
    userID: pg
      .text("user_id")
      .notNull()
      .references(() => users.id),
    relationType: userToProjectRelationTypeEnum("relation_type")
      .notNull()
      .default("tester"),
  },
  table => ({
    pk: pg.primaryKey({
      columns: [table.userID, table.projectID, table.relationType],
    }),
  }),
);

export const userToProjectRelations = relations(usersToProjects, ({ one }) => ({
  project: one(projects, {
    fields: [usersToProjects.userID],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [usersToProjects.userID],
    references: [users.id],
  }),
}));

export const bugSeverityEnum = pg.pgEnum("bug_severity", [
  "critical",
  "high",
  "medium",
  "low",
  "trivial",
  "feature",
]);

export const bugs = createTable("bug", {
  id: pg.serial("id").notNull().primaryKey(),

  filedBy: pg
    .text("filed_by")
    .notNull()
    .references(() => users.id),

  projectID: pg
    .serial("project_id")
    .notNull()
    .references(() => projects.id),

  name: pg.text("name").notNull().default(""),
  description: pg.text("description").notNull().default(""),

  severity: bugSeverityEnum("severity").notNull().default("trivial"),

  createdAt: pg.date("created_at").notNull().defaultNow(),
  updatedAt: pg.date("updatedAt").notNull().defaultNow(),
});

export const bugRelations = relations(bugs, ({ one, many }) => ({
  project: one(projects, {
    fields: [bugs.projectID],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const taskStatusEnum = pg.pgEnum("task_status", [
  "backlog",
  "todo",
  "doing",
  "done",
  "archived",
]);

export const taskPriorityEnum = pg.pgEnum("task_priority", [
  "urgent",
  "high",
  "medium",
  "low",
  "deferred",
  "trivial",
  "undetermined",
]);

export const tasks = createTable("task", {
  id: pg.serial("id").notNull().primaryKey(),

  createdBy: pg
    .text("created_by")
    .notNull()
    .references(() => users.id),
  assignedTo: pg
    .text("assigned_to")
    .notNull()
    .references(() => users.id),
  bugID: pg
    .serial("bug_id")
    .notNull()
    .references(() => bugs.id),

  name: pg.text("name").notNull().default(""),
  description: pg.text("description").notNull().default(""),

  status: taskStatusEnum("status").notNull().default("backlog"),
  priority: taskPriorityEnum("priority").notNull().default("undetermined"),

  createdAt: pg.date("created_at").notNull().defaultNow(),
  updatedAt: pg.date("updatedAt").notNull().defaultNow(),
  dueDate: pg
    .date("due_date", { mode: "date" })
    .notNull()
    .$defaultFn(() => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }),
});

export const taskRelations = relations(tasks, ({ one }) => ({
  bug: one(bugs, {
    fields: [tasks.bugID],
    references: [bugs.id],
  }),
  createdBy: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
}));
