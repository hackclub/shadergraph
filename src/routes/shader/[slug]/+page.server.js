import { redirect, fail, error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function load({ params }) {
	if (params.slug === "new") return { slug: params.slug, tour: true };

	// Fetch shader
	try {
		const [{ shader, user }] = await db
			.select()
			.from(schema.shadersTable)
			.leftJoin(schema.usersTable, eq(schema.shadersTable.userId, schema.usersTable.id))
			.where(eq(schema.shadersTable.id, params.slug));

		console.log({ shader, user });

		return { slug: params.slug, shader, user };
	} catch (e) {
		console.log("there was an error:", e);
		return redirect(307, "/");
	}
}

export const actions = {
	default: async ({ params, request, locals }) => {
		const data = await request.formData();
		const title = data.get("title");
		const state = data.get("state");
		const glsl = data.get("glsl");

		let existingShader;
		try {
			[existingShader] = await db
				.select()
				.from(schema.shadersTable)
				.where(eq(schema.shadersTable.id, params.slug));

			const ownShader = locals.user.id === existingShader.userId;
			if (!ownShader) return fail(401);
		} catch {
			// do nothing
		}

		const [shaderRow] = await db
			.insert(schema.shadersTable)
			.values({
				id: existingShader?.id,
				userId: locals.user.id,
				title,
				state,
				glsl
			})
			.onConflictDoUpdate({
				target: schema.shadersTable.id,
				set: { title, state, glsl, updatedAt: new Date() }
			})
			.returning({ id: schema.shadersTable.id });

		return redirect(302, `/shader/${shaderRow.id}`);
	}
};
