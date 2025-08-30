import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

interface AuthPayload {
  sub: number;
  role: "USER" | "ADMIN";
}

function isAuthPayload(payload: unknown): payload is AuthPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "sub" in payload &&
    "role" in payload
  );
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (isAuthPayload(decoded)) {
      req.user = { id: Number(decoded.sub), role: decoded.role };
      return next();
    } else {
      return next(new AppError("Invalid token payload"));
    }
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const requireRole =
  (role: "USER" | "ADMIN") =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }
    if (req.user.role !== role) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };

export const requireSelfOrAdmin =
  (paramKey: string = "id") =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }
    const userId = Number(req.params[paramKey]);
    if (req.user.role === "ADMIN" || req.user.id === userId) {
      return next();
    }
    return next(new AppError("Forbidden", 403));
  };

export const matchUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }
  if (req.user.id !== req.body.userId) {
    return next(new AppError("Forbidden", 403));
  }
  next();
};
