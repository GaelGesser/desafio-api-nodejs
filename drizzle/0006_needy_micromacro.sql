ALTER TABLE "enrollment" RENAME TO "enrollments";--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollment_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollment_courseId_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;