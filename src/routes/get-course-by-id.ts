import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { eq } from 'drizzle-orm'

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/coursers/:id', {
    schema: {
      tags: ['courses'],
      summary: 'Get a course by id',
      params: z.object({
        id: z.uuid('Invalid UUID')
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.string(),
            title: z.string()
          })
        }),
        404: z.null()
      }
    }
  } , async (request, reply) => {
    const { id } = request.params
    const result = await db.select().from(courses).where(eq(courses.id, id))
  
    if (result.length > 0) {
      return reply.status(200).send({ course: result[0] })
    }
  
    return reply.status(404).send()
  })
}