/* eslint-disable prettier/prettier */

import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MS_HOST: string;
  PRODUCTS_MS_PORT: number;

  ORDERS_MS_HOST: string;
  ORDERS_MS_PORT: number;
}
const envSchema = joi
  .object({
    PORT: joi.number().required(),
    PRODUCTS_MS_HOST: joi.string().required(),
    PRODUCTS_MS_PORT: joi.number().required(),
    ORDERS_MS_HOST: joi.string().required(),
    ORDERS_MS_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  product_ms_host: envVars.PRODUCTS_MS_HOST,
  product_ms_port: envVars.PRODUCTS_MS_PORT,
  orders_ms_host: envVars.ORDERS_MS_HOST,
  orders_ms_port: envVars.ORDERS_MS_PORT,
};
