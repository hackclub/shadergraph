import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";
import { config } from "dotenv";
config({ path: ".env.local" });

export const db = drizzle(sql, { schema });

export async function createUserFromGithub({ githubId, username, name, email, avatarUrl }) {
	console.log("Creating", { githubId, username, name, email, avatarUrl });
	const res = await db
		.insert(schema.usersTable)
		.values({ githubId, username, name, email, avatarUrl })
		.returning({ id: schema.usersTable.id });

	return res[0].id;
}
