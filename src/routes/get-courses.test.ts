import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'
import { makeEnrollment } from '../tests/factories/make-enrollment.ts'
import { makeAuthenticatedUser, makeUser } from '../tests/factories/make-user.ts'
import { v7 as uuidv7 } from 'uuid'

test('get courses', async () => {
  await server.ready()

  const titleId = uuidv7()

  const course = await makeCourse(titleId)
  const user = await makeUser()
  await makeEnrollment(user.id, course.id)

  const { token } = await makeAuthenticatedUser('manager')

  const response = await request(server.server)
    .get(`/coursers?search=${titleId}&page=1&limit=10`)
    .set('Authorization', token)

  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    courses: [
      {
        id: course.id,
        title: course.title,
        enrollments: 1
      }
    ],
    meta: {
      page: 1,
      limit: 10,
      items_received: 1,
      total: 1,
      total_pages: 1
    }
  })
})