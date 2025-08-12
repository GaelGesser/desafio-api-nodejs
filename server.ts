import fastify from 'fastify'
import crypto from 'node:crypto'

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
})

const cousers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Alice Johnson' },
  { id: '4', name: 'Bob Brown' },
]

server.get('/coursers', async (request, reply) => {
  return reply.status(200).send({ cousers})
})

server.post('/coursers', async (request, reply) => {

  const { name} = request.body as { name?: string }

  if (!name) {
    return reply.status(404).send({ message: 'Name is required' })
  }

  cousers.push({
    id: crypto.randomUUID(),
    name: name
  })

  return reply.status(201).send()
})

server.get('/coursers/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const courser = cousers.find(courser => courser.id === id)

  return reply.status(200).send(courser)
})

server.put('/coursers/:id', async (request, reply) => {
  const { id } = request.params as {id: string }
  const { name } = request.body as { name?: string }

  const courserIndex = cousers.findIndex(courser => courser.id === id)

  if (courserIndex < 0) {
    return reply.status(404).send({ message: 'Courser not found' })
  }

  if (!name) {
    return reply.status(404).send({ message: 'Name is required' })
  }

  cousers[courserIndex] = {
    id,
    name
  }

  return reply.status(204).send()
})

server.delete('/coursers/:id', async (request, reply) => {
  const { id } = request.params as { id: string }

  const courserIndex = cousers.findIndex(courser => courser.id === id)

  if (courserIndex < 0) {
    return reply.status(404).send({ message: 'Courser not found' })
  }

  cousers.splice(courserIndex, 1)

  return reply.status(204).send()
})

server.listen({ port: 3333 }).then(() => {
  console.log('Server is running on http://localhost:3333')
})