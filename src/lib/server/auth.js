import { eq } from "drizzle-orm";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCase, encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = "auth-session";

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCase(bytes);
	return token;
}

/**
 * @param {string} token
 * @param {string} userId
 */
export async function createSession(token, userId, userAgent, ipAddress) {
	await db.transaction(async (tx) => {
		const [ua] = await tx
			.insert(schema.userAgentsTable)
			.values({ value: userAgent })
			.onConflictDoNothing()
			.returning({ id: schema.userAgentsTable.id });

		const [session] = await tx
			.insert(schema.sessionsTable)
			.values({
				id: encodeHexLowerCase(sha256(new TextEncoder().encode(token))),
				userId,
				userAgentId: ua.id,
				ipAddress,
				expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
			})
			.returning();

		return session;
	});

	const userAgentId = [0].id;

	const session = await db
		.insert(schema.sessionsTable)
		.values({
			id: encodeHexLowerCase(sha256(new TextEncoder().encode(token))),
			userId,
			userAgentId,
			ipAddress,
			expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
		})
		.returning()[0];

	return session;
}

/** @param {string} token */
export async function validateSessionToken(token) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.user.id, username: table.user.username },
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

/** @param {string} sessionId */
export async function invalidateSession(sessionId) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @param {string} token
 * @param {Date} expiresAt
 */
export function setSessionTokenCookie(event, token, expiresAt) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: "/"
	});
}

/** @param {import("@sveltejs/kit").RequestEvent} event */
export function deleteSessionTokenCookie(event) {
	event.cookies.delete(sessionCookieName, {
		path: "/"
	});
}
