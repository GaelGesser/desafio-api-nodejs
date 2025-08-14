CREATE TABLE "enrollment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"courseId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;