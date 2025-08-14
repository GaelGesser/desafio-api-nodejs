import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

test('get a course by id', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('manager')
  const course = await makeCourse()

  const response = await request(server.server)
  .get(`/coursers/${course.id}`)
  .set('Authorization', token)

  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    course: {
      id: course.id,
      title: course.title
    }
  })
})

test('return 404 if course not found', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('student')

  const response = await request(server.server)
  .get(`/coursers/0198a984-7e68-7369-93a5-a218fe16847b`)
  .set('Authorization', token)

  expect(response.status).toBe(404)
})