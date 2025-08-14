import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import { getCourseByIdRoute } from './routes/get-course-by-id.ts'
import { createCourseRoute } from './routes/create-course.ts'
import { getCoursesRoute } from './routes/get-courses.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { loginRoute } from './routes/login.ts'

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
}).withTypeProvider<ZodTypeProvider>()

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Desafio Node.js',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform,
})

server.register(scalarAPIReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'elysiajs'
  }
})


server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(getCoursesRoute)
server.register(createCourseRoute)
server.register(getCourseByIdRoute)
server.register(loginRoute)

export { server }