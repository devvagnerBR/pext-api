import { Prisma } from "@prisma/client";
import { USER_REPOSITORY } from "./repository";

import * as bcrypt from 'bcryptjs';
import { env } from "../../env";

export class USER_LOGIC {
  constructor(
    private readonly userRepository: USER_REPOSITORY
  ) { }


  async registerNewUser( { name, email, password }: Prisma.UserCreateInput ) {

    const passwordHash = await bcrypt.hash( password, env.BCRYPT_SALT_ROUNDS );
    await this.userRepository.registerNewUser( name, email, passwordHash );

  }

}