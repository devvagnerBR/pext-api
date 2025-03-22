import { FastifyInstance } from "fastify";
import { USER_CONTROLLER } from "../../modules/user/controller";
import { authenticateUserHook } from "../../hooks/authenticate-user";

export async function userRouters( app: FastifyInstance ) {

  const userRequests = await USER_CONTROLLER();

  app.post( "/user/register", userRequests.registerNewUser );
  app.post( "/user/authenticate", userRequests.authenticateUser );
  app.get( "/user", { onRequest: [authenticateUserHook] }, userRequests.findUserById );

  app.post( "/animal/register", { onRequest: [authenticateUserHook] }, userRequests.registerNewAnimal );
  app.get( "/animal", { onRequest: [authenticateUserHook] }, userRequests.getAllAnimals );
  app.get( "/animal/:id", { onRequest: [authenticateUserHook] }, userRequests.getAnimalById );

  app.get( "/animal/search", { onRequest: [authenticateUserHook] }, userRequests.searchAnimals );
  app.put( "/animal/:id", { onRequest: [authenticateUserHook] }, userRequests.updateAnimal );

  app.put( "/animal/:animalId/:parentId", { onRequest: [authenticateUserHook] }, userRequests.changeAnimalParent );
  app.delete( "/animal/:id", { onRequest: [authenticateUserHook] }, userRequests.markAnimalAsDeleted );

  app.get( "/animal/count", { onRequest: [authenticateUserHook] }, userRequests.getAnimalsCountSeparatedBySpecies );
}