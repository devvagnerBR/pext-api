import { Prisma } from "@prisma/client";
import { USER_REPOSITORY } from "./repository";

import * as bcrypt from 'bcryptjs';
import { env } from "../../env";
import { generateToken } from "../../util/generate-token";

export class USER_LOGIC {
  constructor(
    private readonly userRepository: USER_REPOSITORY
  ) { }

  async registerNewUser( { name, email, password }: Prisma.UserCreateInput ) {
    const passwordHash = await bcrypt.hash( password, env.BCRYPT_SALT_ROUNDS );
    await this.userRepository.registerNewUser( name, email, passwordHash );
  }

  async authenticateUser( email: string, password: string ) {
    const user = await this.userRepository.authenticateUser( email, password );
    const token = await generateToken( user.id );
    return token;
  }

  async findUserById( id: string ) {
    const user = await this.userRepository.findUserById( id );
    return user;
  }

  async registerNewAnimal( data: Prisma.AnimalCreateManyInput ) {
    await this.userRepository.registerNewAnimal( data );
  }

  async getAllAnimals( page: number, query: string ) {
    const animals = await this.userRepository.getAllAnimals( page, query );
    return animals;
  }
  async getAnimalById( id: string ) {
    const animal = await this.userRepository.getAnimalById( id );
    return animal;
  }

  async searchAnimals( search: string ) {
    const animals = await this.userRepository.searchAnimals( search );
    return animals;
  }

  async updateAnimal( id: string, data: Prisma.AnimalUpdateInput ) {
    await this.userRepository.updateAnimal( id, data );
  }

  async changeAnimalParent( animalId: string, parentId: string ) {
    await this.userRepository.changeAnimalParent( animalId, parentId );
  }

  async markAnimalAsDeleted( id: string ) {
    await this.userRepository.markAnimalAsDeleted( id );
  }
  async getAnimalsCountSeparatedBySpecies() {
    const animals = await this.userRepository.getAnimalsCountSeparatedBySpecies();
    return animals;
  }
}