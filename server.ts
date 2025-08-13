import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts'
import { createCourseRoute } from './src/routes/create-course.ts'
import { getCoursesRoute } from './src/routes/get-courses.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'

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

server.listen({ port: 3333 }).then(() => {
  console.log('Server is running on http://localhost:3333')
})