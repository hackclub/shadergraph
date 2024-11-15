import { redirect } from "@sveltejs/kit";
import { generateState } from "arctic";
import { github } from "$lib/server/oauth";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const actions = {
	login: async (event) => {
		const state = generateState();
		const url = github.createAuthorizationURL(state, []);

		event.cookies.set("github_oauth_state", state, {
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax"
		});

		return redirect(302, url.toString());
	},
	logout: async (event) => {
		console.log("LOGGING OUT", event);
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		console.log("deleted cookie");
		return redirect(302, "/");
	},
	prefs: async ({ request, locals }) => {
		const data = await request.formData();
		const language = data.get("language");
		console.log(language, locals);
		await db
			.insert(schema.userPreferencesTable)
			.values({ userId: locals.user.id })
			.onConflictDoUpdate({
				target: schema.userPreferencesTable.userId,
				set: { language }
			});

		return { success: true };
	}
};
