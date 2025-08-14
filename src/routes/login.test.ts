import { server } from '../app.ts'
import { expect, test } from 'vitest'
import { makeUser } from '../tests/factories/make-user.ts'
import request from 'supertest'

test('login', async () => {
  await server.ready()

  const { email, passwordBeforeHash } = await makeUser()

  const response = await request(server.server)
    .post('/sessions')
    .set('Content-Type', 'application/json')
    .send({
      email,
      password: passwordBeforeHash
    })

  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    token: expect.any(String)
  })
})