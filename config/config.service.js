import { resolve } from "node:path";
import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV;

const envPath = {
  development: `.env.development`,
  production: `.env.production`,
};
console.log({ en: envPath[NODE_ENV] });

config({ path: resolve(`./config/${envPath[NODE_ENV]}`) });

export const port = process.env.PORT ?? 7000;

export const SALT=parseInt(process.env.SALT)

export const ENCRYPTION_KEY=Buffer.from(process.env.ENCRYPTION_KEY)
export const IVLENGTH=parseInt(process.env.IVLENGTH)


export const KEY_ACCESS=process.env.KEY_ACCESS
export const KEY_REFRESH=process.env.KEY_REFRESH


