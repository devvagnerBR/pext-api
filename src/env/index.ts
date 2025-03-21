import { z } from "zod";
import 'dotenv/config'

const envSchema = z.object( {
    NODE_ENV: z.enum( ['dev', 'test', 'production'] ).default( 'dev' ),
    PORT: z.coerce.number().default( 3003 ),
    JWT_SECRET: z.string(),
    BCRYPT_SALT_ROUNDS: z.coerce.number(),
} )

const _env = envSchema.safeParse( process.env )

if ( !_env.success ) {
    console.log( '❌ Invalid environment variables', _env.error.format() )
    throw new Error( 'Invalid environment variables' )
}

export const env = _env.data
