import dotenv from 'dotenv'
dotenv.config()

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  DATABASE_URL: process.env.DATABASE_URL || '',
}