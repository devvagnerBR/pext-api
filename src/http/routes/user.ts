import { FastifyInstance } from "fastify";
import { USER_CONTROLLER } from "../../modules/user/controller";

export async function userRouters( app: FastifyInstance ) {

  const userRequests = await USER_CONTROLLER();

  app.post( "/user/register", userRequests.registerNewUser );

}