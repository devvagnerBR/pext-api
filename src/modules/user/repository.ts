import { Prisma } from "@prisma/client";
import { PRISMA } from "../../db/prisma";
import { CustomError } from "../../entities/custom-error";
import * as bcrypt from 'bcryptjs';


export class USER_REPOSITORY {

  // user
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

  async authenticateUser( email: string, password: string ) {
    const user = await PRISMA.user.findUnique( { where: { email } } );
    if ( !user ) throw new CustomError( 404, "Usuário não encontrado" );

    const passwordMatch = await bcrypt.compare( password, user.password );
    if ( !passwordMatch ) throw new CustomError( 401, "Senha inválida" );

    return user;
  }

  async findUserById( id: string ) {
    const user = await PRISMA.user.findUnique( {
      where: { id, status: true },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    } );

    if ( !user ) throw new CustomError( 404, "Usuário não encontrado" );
    return user;
  }

  // animal

  async registerNewAnimal( data: Prisma.AnimalCreateInput, childrenData?: Prisma.AnimalCreateInput[] ) {
    const newAnimal = await PRISMA.animal.create( {
      data: {
        ...data,
        children: {
          create: childrenData || []
        }
      }
    } );

    return newAnimal;
  }

  async getAllAnimals( page: number = 1, pageSize: number = 12 ) {

    const skip = ( page - 1 ) * pageSize;
    const animals = await PRISMA.animal.findMany( {
      skip,
      take: pageSize,
      include: {
        children: true
      }
    } );
    return animals;
  }

  async getAnimalById( id: string ) {
    const animal = await PRISMA.animal.findUnique( {
      where: { id },
      include: {
        children: true
      }
    } );
    if ( !animal ) throw new CustomError( 404, "Animal não encontrado" );
    return animal;
  }

  async serachAnimal( search: string ) {
    const animals = await PRISMA.animal.findMany( {
      where: {
        OR: [
          { nome: { contains: search } },
          { maturidade: { contains: search } },
          { microchip: { contains: search } },
          { raca: { contains: search } },
          { sexo: { contains: search } },
          { origem: { contains: search } },
          { porte: { contains: search } },
          { comportamento: { contains: search } },
          { especie: { contains: search } },
          { doencas: { hasSome: [search] } },
          { status: { contains: search } },
        ]
      },
      include: {
        children: true
      }
    } );
    return animals;
  }

  async updateAnimal( id: string, data: Prisma.AnimalUpdateInput ) {

    const animalExists = await PRISMA.animal.findUnique( { where: { id } } );
    if ( !animalExists ) throw new CustomError( 404, "Animal não encontrado" );

    const animal = await PRISMA.animal.update( {
      where: { id },
      data
    } );
    return animal;
  }

  async changeAnimalParent( animalId: string, NewParentId: string ) {

    const animalExists = await PRISMA.animal.findUnique( { where: { id: animalId } } );
    if ( !animalExists ) throw new CustomError( 404, "Animal não encontrado" );

    const parentExists = await PRISMA.animal.findUnique( { where: { id: NewParentId } } );
    if ( !parentExists ) throw new CustomError( 404, "Novo pai não encontrado" );

    await PRISMA.animal.update( {
      where: { id: animalId },
      data: {
        parentId: NewParentId
      }
    } );
  }


}