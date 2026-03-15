import * as Joi from 'joi';

export const envConfig = () => ({
  database: {
    // host: process.env.DB_HOST,
    // port: parseInt(process.env.DB_PORT as string, 10) || 3306,
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  },
  app: {
    port: parseInt(process.env.APP_PORT as string, 10) || 3000,
    name: process.env.APP_NAME,
    environment: process.env.NODE_ENV || 'development',
  },
  // jwt: {
  //   secret: process.env.JWT_SECRET,
  //   expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  // },
});

export const envValidatinSchema = Joi.object({
  DATABASE: Joi.string().required(),
  APP_NAME: Joi.string().default('Url shortener'),
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
})

// export const envValidationSchema = Joi.object({
//   // Database Configuration
//   // DB_HOST: Joi.string().required().messages({
//   //   'string.empty': 'DB_HOST is required',
//   //   'any.required': 'DB_HOST is required',
//   // }),
//   // DB_PORT: Joi.number().default(3306).messages({
//   //   'number.base': 'DB_PORT must be a number',
//   // }),
//   // DB_USERNAME: Joi.string().required().messages({
//   //   'string.empty': 'DB_USERNAME is required',
//   //   'any.required': 'DB_USERNAME is required',
//   // }),
//   // DB_PASSWORD: Joi.string().required().messages({
//   //   'string.empty': 'DB_PASSWORD is required',
//   //   'any.required': 'DB_PASSWORD is required',
//   // }),
//   DB_NAME: Joi.string().required().messages({
//     'string.empty': 'DB_NAME is required',
//     'any.required': 'DB_NAME is required',
//   }),
//
//   // Application Configuration
//   NODE_ENV: Joi.string()
//     .valid('development', 'production', 'staging')
//     .default('development')
//     .messages({
//       'any.only': 'NODE_ENV must be one of: development, production, staging',
//     }),
//   APP_PORT: Joi.number().default(3000).messages({
//     'number.base': 'APP_PORT must be a number',
//   }),
//   APP_NAME: Joi.string().default('NestJS Application'),
//
//   // JWT Configuration
//   // JWT_SECRET: Joi.string().required().messages({
//   //   'string.empty': 'JWT_SECRET is required',
//   //   'any.required': 'JWT_SECRET is required',
//   // }),
//   // JWT_EXPIRES_IN: Joi.string().default('3600s'),
// });
