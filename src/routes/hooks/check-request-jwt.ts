import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

type JwtPayload = {
  sub: string
  role: 'student' | 'manager'
}

export const checkRequestJwt = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers.authorization

  if (!token) {
    return reply.status(401).send()
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

    request.user = payload

  } catch {
    return reply.status(401).send()
  }
}