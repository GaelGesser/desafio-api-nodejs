import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { fakerPT_BR as faker } from "@faker-js/faker";

export async function makeUser() {
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }

  const result = await db.insert(users).values(user).returning()

  return result[0]
}