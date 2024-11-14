import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/auth";
import { createUserFromGithub } from "$lib/server/db";
import { github } from "$lib/server/oauth";

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
	// const existingUser = await getUserFromGitHubId(githubUserId);

	// if (existingUser) {
	// 	const sessionToken = generateSessionToken();
	// 	const session = await createSession(sessionToken, user.id);
	// 	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	// 	return new Response(null, {
	// 		status: 302,
	// 		headers: {
	// 			Location: "/"
	// 		}
	// 	});
	// }

	// // TODO: Replace this with your own DB query.
	const userId = await createUserFromGithub({
		githubId,
		username: githubUsername,
		name: githubName,
		email: githubEmail,
		avatarUrl: githubAvatarUrl
	});

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, userId, event.clientAddress);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}
