import { db } from "../../database/client.ts";
import { enrollments } from "../../database/schema.ts";
import { fakerPT_BR as faker } from "@faker-js/faker";

export async function makeEnrollment(userId?: string, courseId?: string) {
  const enrollment = {
    userId: userId ?? faker.string.uuid(),
    courseId: courseId ?? faker.string.uuid(),
  }

  const result = await db.insert(enrollments).values(enrollment).returning()

  return result[0]
}