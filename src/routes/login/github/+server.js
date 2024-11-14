import { generateState } from "arctic";
import { github } from "$lib/server/oauth";

export async function GET(event) {
	console.log(event.clientAddress);
	return new Response(null);
	const state = generateState();
	const url = github.createAuthorizationURL(state, []);

	event.cookies.set("github_oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
