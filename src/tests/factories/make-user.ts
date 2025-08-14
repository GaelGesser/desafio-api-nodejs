import { randomUUID } from "node:crypto";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { hash } from "argon2";
import jwt from "jsonwebtoken";

export async function makeUser() {
  const passwordBeforeHash = randomUUID()
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await hash(passwordBeforeHash),
  }

  const result = await db.insert(users).values(user).returning()

  return {
    ...result[0],
    passwordBeforeHash
  }
}

export async function makeAuthenticatedUser(role: 'manager' | 'student') {
  const user = await makeUser()

  const token = jwt.sign({
    sub: user.id,
    role,
  }, process.env.JWT_SECRET as string, {
    expiresIn: '24h'
  })

  return {
    user,
    token
  }
}