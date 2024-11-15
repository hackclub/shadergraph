import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";
import { github } from "$lib/server/oauth";
import { eq } from "drizzle-orm";

export async function GET(event) {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});

	const githubUser = await githubUserResponse.json();
	const githubId = githubUser.id;
	const githubUsername = githubUser.login;
	const githubEmail = githubUser.email;
	const githubName = githubUser.name;
	const githubAvatarUrl = githubUser.avatar_url;

	console.log(githubUser);

	// TODO: Replace this with your own DB query.
	const existingUser = await db.query.usersTable.findFirst({
		where: eq(schema.usersTable.githubId, githubId)
	});

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(
			sessionToken,
			existingUser.id,
			event.request.headers.get("user-agent"),
			event.getClientAddress()
		);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	// Create user
	const [user] = await db
		.insert(schema.usersTable)
		.values({
			githubId,
			username: githubUsername,
			name: githubName,
			email: githubEmail,
			avatarUrl: githubAvatarUrl
		})
		.returning({ id: schema.usersTable.id });

	const sessionToken = generateSessionToken();
	const session = await createSession(
		sessionToken,
		user.id,
		event.request.headers.get("user-agent"),
		event.getClientAddress()
	);
	console.log(session);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}
