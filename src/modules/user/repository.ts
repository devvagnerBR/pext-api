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

  async registerNewAnimal( data: Prisma.AnimalCreateManyInput ) {



    try {
      // Verificar se o parentalId existe, se fornecido
      if ( data.parentId ) {
        const parentExists = await PRISMA.animal.findUnique( {
          where: { id: data.parentId }
        } );

        if ( !parentExists ) {
          throw new CustomError( 404, "Animal pai/mãe não encontrado" );
        }
      }



      // Criar novo animal
      const newAnimal = await PRISMA.animal.create( {

        data: {

          parentId: data.parentId || null,
          nome: data.nome,
          maturidade: data.maturidade,
          microchip: data.microchip,
          raca: data.raca,
          sexo: data.sexo,
          origem: data.origem,
          porte: data.porte,
          comportamento: data.comportamento,
          especie: data.especie.toLowerCase(),
          doencas: data.doencas,
          status: data.status,
        }
      } );

      return newAnimal;

    } catch ( error ) {
      console.log( error );
      throw new CustomError( 500, "Erro ao registrar novo animal" );
    }
  }

  async getAllAnimals( page: number = 2, search: string ) {

    const pageSize = 12
    const skip = ( page - 1 ) * pageSize;
    const searchLower = search.toLowerCase();
    const animals = await PRISMA.animal.findMany( {
      where: {
        isDeleted: false,
        OR: [
          { nome: { contains: searchLower, mode: 'insensitive' } },
          { maturidade: { contains: searchLower, mode: 'insensitive' } },
          { microchip: { contains: searchLower, mode: 'insensitive' } },
          { raca: { contains: searchLower, mode: 'insensitive' } },
          { sexo: { contains: searchLower, mode: 'insensitive' } },
          { origem: { contains: searchLower, mode: 'insensitive' } },
          { porte: { contains: searchLower, mode: 'insensitive' } },
          { comportamento: { contains: searchLower, mode: 'insensitive' } },
          { especie: { contains: searchLower, mode: 'insensitive' } },
          { doencas: { hasSome: [searchLower] } },
          { status: { contains: searchLower, mode: 'insensitive' } },
        ]

      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        children: true
      }
    } );

    const totalAnimals = await PRISMA.animal.count( { where: { isDeleted: false } } );
    const totalPages = Math.ceil( totalAnimals / pageSize );
    const nextPage = page < totalPages ? page + 1 : null;
    const data = animals

    return {
      data,
      totalAnimals,
      currentPage: page,
      nextPage,
      totalPages,
    };
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

  async searchAnimals( search: string ) {

    const searchLower = search.toLowerCase();
    const animals = await PRISMA.animal.findMany( {
      where: {
        OR: [
          { nome: { contains: searchLower, mode: 'insensitive' } },
          { maturidade: { contains: searchLower, mode: 'insensitive' } },
          { microchip: { contains: searchLower, mode: 'insensitive' } },
          { raca: { contains: searchLower, mode: 'insensitive' } },
          { sexo: { contains: searchLower, mode: 'insensitive' } },
          { origem: { contains: searchLower, mode: 'insensitive' } },
          { porte: { contains: searchLower, mode: 'insensitive' } },
          { comportamento: { contains: searchLower, mode: 'insensitive' } },
          { especie: { contains: searchLower, mode: 'insensitive' } },
          { doencas: { hasSome: [searchLower] } },
          { status: { contains: searchLower, mode: 'insensitive' } },
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

  async markAnimalAsDeleted( id: string ) {

    const animalAlreadyDeleted = await PRISMA.animal.findUnique( { where: { id, isDeleted: true } } );
    if ( animalAlreadyDeleted ) throw new CustomError( 404, "Animal não encontrado" );

    await PRISMA.animal.update( {
      where: { id },
      data: {
        isDeleted: true
      }
    } );
  }

  async getAnimalsCountSeparatedBySpecies() {
    const animals = await PRISMA.animal.groupBy( {
      by: ['especie'],
      _count: {
        id: true
      }
    } );


    const totalCats = animals.find( animal => animal.especie === 'gato' )?._count.id || 0;
    const totalDogs = animals.find( animal => animal.especie === 'cachorro' )?._count.id || 0;

    return {
      gatos: totalCats,
      cachorros: totalDogs,
      total: totalCats + totalDogs
    }

  }

}