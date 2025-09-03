import { env } from "../config/env";

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  maxAge: env.COOKIE_MAX_AGE,
  sameSite: "lax" as const,
  path: "/",
};
