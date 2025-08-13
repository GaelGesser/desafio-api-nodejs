import { db } from "../database/client.ts"
import { courses } from '../database/schema.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/coursers', {
    schema: {
      tags: ['courses'],
      summary: 'Create a new course',
      body: z.object({
        title: z.string().min(1, 'Title is required')
      }),
      response: {
        201: z.object({
          courseId: z.uuid()
        }).describe('The id of the created course successfully')
      }
    }
  }, async (request, reply) => {
  
    const { title } = request.body
  
    const result = await db
      .insert(courses)
      .values({title})
      .returning()
  
    return reply.status(201).send({ courseId: result[0].id })
  })
  
}