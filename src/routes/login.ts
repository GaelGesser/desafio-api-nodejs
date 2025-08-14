import { eq } from "drizzle-orm"
import { db } from "../database/client.ts"
import { users } from '../database/schema.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verify } from "argon2"
import jwt from "jsonwebtoken"

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/sessions', {
    schema: {
      tags: ['auth'],
      summary: 'Login',
      body: z.object({
        email: z.email('Invalid Email'),
        password: z.string().min(1, 'Password is required')
      }),
      response: {
        200: z.object({
          token: z.string().describe('JWT Token')
        }),
        400: z.object({
          message: z.string().describe('Invalid credentials')
        })
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body

    const [user] = await db.select().from(users).where(eq(users.email, email))
    
    if (!user) { return reply.status(400).send({ message: 'Invalid credentials' }) }
    
    const doesPasswordMatch = await verify(user.password, password)

    if (!doesPasswordMatch) { return reply.status(400).send({ message: 'Invalid credentials' }) }

    const token = jwt.sign({
      sub: user.id,
      role: user.role,
    }, process.env.JWT_SECRET as string, {
      expiresIn: '24h'
    })

    return reply.status(200).send({
      token
    })
  })
  
}