import { FastifyReply, FastifyRequest } from "fastify";
import { makeUser } from "../../factories/make-user"
import { z } from "zod";


export async function USER_CONTROLLER() {

  const userLogic = await makeUser();

  async function registerNewUser( req: FastifyRequest, res: FastifyReply ) {

    const newUserSchema = z.object( {
      name: z.string().min( 3 ),
      email: z.string().email(),
      password: z.string().min( 6 )
    } );

    const newUserBody = newUserSchema.safeParse( req.body );
    if ( !newUserBody.success ) return res.status( 400 ).send( newUserBody.error.format() );

    await userLogic.registerNewUser( newUserBody.data );
    res.status( 201 ).send( { message: "Usuário criado com sucesso" } );

  }

  return { registerNewUser }
}