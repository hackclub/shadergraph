import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	githubId: text("github_id"),
	username: text("username"),
	name: text("name"),
	email: text("email").notNull(),
	avatarUrl: text("avatar_url")
});

export const userAgentsTable = pgTable("user_agent", {
	id: uuid("id").primaryKey().defaultRandom(),
	value: text("value").unique(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow()
});

export const sessionsTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id),
	userAgentId: uuid("user_agent_id")
		.notNull()
		.references(() => userAgentsTable.id),
	ipAddress: text("ip_address"),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull()
});

export const themeEnum = pgEnum("theme", ["light", "dark", "system"]);
export const userPreferencesTable = pgTable("user_preferences", {
	userId: uuid("user_id")
		.primaryKey()
		.references(() => usersTable.id),
	language: text("language").notNull().default("en"),
	theme: themeEnum("theme").notNull().default("system"),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const shadersTable = pgTable("shader", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => usersTable.id),
	title: text("title").notNull(),
	state: text("state").notNull(),
	glsl: text("glsl").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow()
});
