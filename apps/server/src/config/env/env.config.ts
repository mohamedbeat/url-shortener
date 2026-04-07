import * as Joi from 'joi';

export const envConfig = () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10) || 3306,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  app: {
    port: parseInt(process.env.APP_PORT as string, 10) || 3000,
    name: process.env.APP_NAME,
    environment: process.env.NODE_ENV || 'development',
    frontEndUrl: process.env.FRONTEND_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '3600s',
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  aws: {
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
});

export const envValidationSchema = Joi.object({
  // Database validation
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // App validation
  APP_PORT: Joi.number().port().default(3000),
  APP_NAME: Joi.string().default('Url shortener'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  FRONTEND_URL: Joi.string().required(),

  // Auth validation
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('3600s'),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),

  // AWS validation
  AWS_ENDPOINT: Joi.string().uri().default('http://localhost:9000'),
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
});
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
