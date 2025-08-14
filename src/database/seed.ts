import { db } from "./client.ts"
import { courses, enrollments, users } from "./schema.ts"
import { fakerPT_BR as faker } from "@faker-js/faker"

async function seed() {
  console.log('Starting seed...')
  
  console.log('Inserting users...')
  const usersInsert = await db.insert(users).values([
    { name: faker.person.fullName(), email: faker.internet.email() },
    { name: faker.person.fullName(), email: faker.internet.email() },
    { name: faker.person.fullName(), email: faker.internet.email() },
  ]).returning()

  console.log('Inserting courses...')
  const coursesInsert = await db.insert(courses).values([
    { title: faker.lorem.words(4) },
    { title: faker.lorem.words(4) },
  ]).returning()  

  console.log('Inserting enrollment...')
  await db.insert(enrollments).values([
    { courseId: coursesInsert[0].id, userId: usersInsert[0].id },
    { courseId: coursesInsert[1].id, userId: usersInsert[1].id },
    { courseId: coursesInsert[0].id, userId: usersInsert[2].id },
  ])

  console.log('Seed completed!')
}

seed()