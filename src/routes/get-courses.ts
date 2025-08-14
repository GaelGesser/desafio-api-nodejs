import { db } from "../database/client.ts"
import { courses, enrollments } from "../database/schema.ts"
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { and, asc, count, eq, ilike, SQL } from "drizzle-orm"
import z from 'zod'

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/coursers', {
    schema: {
      tags: ['courses'],
      summary: 'Get all courses',
      querystring: z.object({
        search: z.string().optional(),
        orderBy: z.enum(['id','title', 'createdAt']).optional().default('createdAt'),
        page: z.coerce.number().optional().default(1),
        limit: z.coerce.number().optional().default(5),
      }),
      response: {
        200: z.object({
          courses: z.array(z.object({
            id: z.string(),
            title: z.string(),
            enrollments: z.number()
          })),
          meta: z.object({
            page: z.number(),
            limit: z.number(),
            items_received: z.number(),
            total: z.number(),
            total_pages: z.number(),
          })
        })
      }
    }
  }, async (request, reply) => {
    const { search, orderBy, page, limit } = request.query

    const conditions: SQL[] = []

    if (search) {
      conditions.push(ilike(courses.title, `%${search}%`))
    }

    const offset = (page - 1) * limit

    const [result, total] = await Promise.all([
      db.select({
        id: courses.id,
        title: courses.title,
        enrollments: count(enrollments.id)
      })
      .from(courses)
      .where(and(...conditions))
      .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
      .orderBy(asc(courses[orderBy]))
      .offset(offset)
      .limit(limit)
      .groupBy(courses.id),
      db.$count(courses, and(...conditions))
    ])

    const meta = {
      page,
      limit,
      items_received: result.length,
      total,
      total_pages: Math.ceil(total / limit),
    }
  
    return reply.status(200).send({ courses: result, meta })
  })
}