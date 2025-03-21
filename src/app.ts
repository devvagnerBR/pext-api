import fastify from "fastify";
import cors from '@fastify/cors';
import { ZodError } from "zod";
import { CustomError } from "./entities/custom-error";

import fastifyJwt from "@fastify/jwt";
import { env } from "./env";
import { userRouters } from "./http/routes/user";


export const app = fastify( {
  bodyLimit: 10485760,  // 10mb
  connectionTimeout: 0, // 0ms
  requestTimeout: 0,    // 0ms
} );

app.register( cors, {
  origin: 'http://localhost:3000',
  credentials: true,
} );

app.register( fastifyJwt, {
  secret: env.JWT_SECRET,
} );

app.register( userRouters );

app.setErrorHandler( ( error, request, reply ) => {
  if ( error instanceof ZodError ) {
    reply.status( 400 ).send( { message: error.errors } );
  } else if ( error instanceof CustomError ) {
    reply.status( error.statusCode ).send( { message: error.message } );
  } else {
    reply.status( 500 ).send( { message: 'Internal Server Error' } );
  }
} );