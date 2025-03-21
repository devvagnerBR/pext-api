import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticateUserHook( req: FastifyRequest, res: FastifyReply ) {
  try {
    await req.jwtVerify()
  } catch {
    return res.status( 401 ).send( { message: 'Não autorizado. Token expirado ou inválido' } )
  }
}