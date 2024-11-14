CREATE TABLE IF NOT EXISTS "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"user_agent_id" uuid NOT NULL,
	"ip_address" text,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_agent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" text,
	"username" text,
	"name" text,
	"email" text NOT NULL,
	"avatar_url" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_agent_id_user_agent_id_fk" FOREIGN KEY ("user_agent_id") REFERENCES "public"."user_agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
