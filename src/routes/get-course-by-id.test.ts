import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'

test('get a course by id', async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server).get(`/coursers/${course.id}`)

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

  const response = await request(server.server).get(`/coursers/0198a984-7e68-7369-93a5-a218fe16847b`)

  expect(response.status).toBe(404)
})