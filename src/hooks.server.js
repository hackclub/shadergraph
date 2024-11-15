import { sequence } from "@sveltejs/kit/hooks";
import * as auth from "$lib/server/auth";
import { i18n } from "$lib/i18n";
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
const handleParaglide = i18n.handle();

const handleAuth = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	// event.locals.prefs = await db.query.userPreferencesTable.findFirst({
	// 	where: eq(schema.userPreferencesTable.userId, user.id)
	// });

	return resolve(event);
};

export const handle = sequence(handleParaglide, handleAuth);
