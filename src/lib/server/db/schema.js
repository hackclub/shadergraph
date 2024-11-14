import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

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
	value: text("value").notNull(),
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
