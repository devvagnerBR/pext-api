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

  async function authenticateUser( req: FastifyRequest, res: FastifyReply ) {

    const authenticateSchema = z.object( {
      email: z.string().email(),
      password: z.string()
    } );

    const authenticateBody = authenticateSchema.safeParse( req.body );
    if ( !authenticateBody.success ) return res.status( 400 ).send( authenticateBody.error.format() );

    const token = await userLogic.authenticateUser( authenticateBody.data.email, authenticateBody.data.password );
    res.status( 200 ).send( { token } );
  }
  async function findUserById( req: FastifyRequest, res: FastifyReply ) {

    const userId = req.user.sub;

    const user = await userLogic.findUserById( userId );
    res.status( 200 ).send( user );

  };

  async function registerNewAnimal( req: FastifyRequest, res: FastifyReply ) {

    const newAnimalSchema = z.object( {
      nome: z.string().min( 3 ),
      maturidade: z.string().min( 3 ),
      microchip: z.string().min( 3 ),
      raca: z.string().min( 3 ),
      sexo: z.string().min( 3 ),
      origem: z.string().min( 3 ),
      porte: z.string().min( 3 ),
      parentId: z.string().optional(),
      comportamento: z.string().min( 3 ),
      especie: z.string().min( 3 ),
      doencas: z.array( z.string() ),
      status: z.string().min( 3 ),
    } );


    const newAnimalBody = newAnimalSchema.safeParse( req.body );
    if ( !newAnimalBody.success ) return res.status( 400 ).send( newAnimalBody.error.format() );
    const animalData = newAnimalBody.data;
    await userLogic.registerNewAnimal( animalData );
    res.status( 201 ).send( { message: "animal cadastrado com sucesso" } );
  }

  async function getAllAnimals( req: FastifyRequest, res: FastifyReply ) {


    const pageSchema = z.object( {
      p: z.string(),
      pageSize: z.number().int().positive().optional(),
      q: z.string().optional()
    } );
    const pageQuery = pageSchema.safeParse( req.query );
    if ( !pageQuery.success ) return res.status( 400 ).send( pageQuery.error.format() );


    const animals = await userLogic.getAllAnimals( Number( pageQuery.data.p ), String( pageQuery.data.q || '' ) );

    res.status( 200 ).send( animals );
  }

  async function getAnimalById( req: FastifyRequest, res: FastifyReply ) {

    const animalIdSchema = z.object( {
      id: z.string()
    } );

    const animalIdBody = animalIdSchema.safeParse( req.params );
    if ( !animalIdBody.success ) return res.status( 400 ).send( animalIdBody.error.format() );

    const animal = await userLogic.getAnimalById( animalIdBody.data.id );
    res.status( 200 ).send( animal );
  }

  async function searchAnimals( req: FastifyRequest, res: FastifyReply ) {

    const searchSchema = z.object( {
      q: z.string().min( 3 )
    } );
    const searchBody = searchSchema.safeParse( req.query );
    if ( !searchBody.success ) return res.status( 400 ).send( searchBody.error.format() );

    const animals = await userLogic.searchAnimals( searchBody.data.q );
    res.status( 200 ).send( animals );
  }

  async function updateAnimal( req: FastifyRequest, res: FastifyReply ) {

    console.log( req.body )

    const animalIdSchema = z.object( {
      id: z.string()
    } );

    const animalIdBody = animalIdSchema.safeParse( req.params );
    if ( !animalIdBody.success ) return res.status( 400 ).send( animalIdBody.error.format() );

    const updateAnimalSchema = z.object( {
      nome: z.string().min( 3 ).optional(),
      maturidade: z.string().min( 3 ).optional(),
      microchip: z.string().min( 3 ).optional(),
      raca: z.string().min( 3 ).optional(),
      sexo: z.string().min( 3 ).optional(),
      origem: z.string().min( 3 ).optional(),
      porte: z.string().min( 3 ).optional(),
      comportamento: z.string().min( 3 ).optional(),
      especie: z.string().min( 3 ).optional(),
      doencas: z.array( z.string() ).optional(),
      status: z.string().min( 3 ).optional(),
    } );

    const updateAnimalBody = updateAnimalSchema.safeParse( req.body );
    if ( !updateAnimalBody.success ) return res.status( 400 ).send( updateAnimalBody.error.format() );

    const animalData = updateAnimalBody.data;
    await userLogic.updateAnimal( animalIdBody.data.id, animalData );
    res.status( 200 ).send( { message: "Animal atualizado com sucesso" } );
  }

  async function changeAnimalParent( req: FastifyRequest, res: FastifyReply ) {
    const animalSchema = z.object( {
      animalId: z.string(), // cm8ivayd10002i6v8s0geglvl feijnao 2
      parentId: z.string() // cm8iw2ru40001i6ms5rg0w1vr arroz 1
    } );

    const animalBody = animalSchema.safeParse( req.body );
    if ( !animalBody.success ) return res.status( 400 ).send( animalBody.error.format() );

    await userLogic.changeAnimalParent( animalBody.data.animalId, animalBody.data.parentId );
    res.status( 200 ).send( { message: "Pai do animal alterado com sucesso" } );
  }

  async function markAnimalAsDeleted( req: FastifyRequest, res: FastifyReply ) {

    const animalIdSchema = z.object( {
      id: z.string()
    } );
    console.log( req.params )

    const animalIdBody = animalIdSchema.safeParse( req.params );
    if ( !animalIdBody.success ) return res.status( 400 ).send( animalIdBody.error.format() );

    await userLogic.markAnimalAsDeleted( animalIdBody.data.id );
    res.status( 200 ).send( { message: "Animal marcado como deletado" } );

  }

  async function getAnimalsCountSeparatedBySpecies( req: FastifyRequest, res: FastifyReply ) {
    const animals = await userLogic.getAnimalsCountSeparatedBySpecies();
    res.status( 200 ).send( animals );
  }


  return {
    registerNewUser,
    authenticateUser,
    findUserById,
    registerNewAnimal,
    getAllAnimals,
    getAnimalById,
    searchAnimals,
    updateAnimal,
    changeAnimalParent,
    markAnimalAsDeleted,
    getAnimalsCountSeparatedBySpecies
  }
}