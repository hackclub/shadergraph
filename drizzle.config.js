import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

if (!process.env.POSTGRES_URL) throw new Error("DATABASE_URL is not set");

export default defineConfig({
	schema: "./src/lib/server/db/schema.js",
	out: "./migrations",
	dbCredentials: {
		url: process.env.POSTGRES_URL
	},

	verbose: true,
	strict: true,
	dialect: "postgresql"
});
