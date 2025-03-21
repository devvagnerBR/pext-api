import { Prisma } from "@prisma/client";
import { PRISMA } from "../../db/prisma";
import { CustomError } from "../../entities/custom-error";



export class USER_REPOSITORY {


  async registerNewUser( name: string, email: string, password: string ) {

    const emailAlreadyExists = await PRISMA.user.findUnique( { where: { email } } );
    if ( emailAlreadyExists ) throw new CustomError( 409, "Esse email já está em uso" );



    await PRISMA.user.create( {
      data: {
        name,
        email,
        password
      }
    } );
  }

}