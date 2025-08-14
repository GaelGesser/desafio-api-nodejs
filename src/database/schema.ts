import { pgTable,uuid, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const users = pgTable('users', {
  id: uuid().primaryKey().$defaultFn(() => uuidv7()),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const courses = pgTable('courses', {
  id: uuid().primaryKey().$defaultFn(() => uuidv7()),
  title: text().notNull().unique(),
  description: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const enrollments = pgTable('enrollments', {
  id: uuid().primaryKey().$defaultFn(() => uuidv7()),
  userId: uuid().references(() => users.id).notNull(),
  courseId: uuid().references(() => courses.id).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
  uniqueIndex().on(table.userId, table.courseId)
])