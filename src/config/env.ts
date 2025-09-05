import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  COOKIE_MAX_AGE: Number(process.env.COOKIE_MAX_AGE) || 3600000,
  NODE_ENV: process.env.NODE_ENV || "development",
  ADMIN_NAME: process.env.ADMIN_NAME || "",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
};
