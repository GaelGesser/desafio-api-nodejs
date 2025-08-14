CREATE TYPE "public"."user_roles" AS ENUM('manager', 'student');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "student" "user_roles" DEFAULT 'student' NOT NULL;