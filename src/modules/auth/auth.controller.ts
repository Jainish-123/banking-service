import { Request, Response, NextFunction } from "express";
import authService from "./auth.service";
import { cookieOptions } from "../../lib/session";
import { AppError } from "../../middlewares/errorHandler";

class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const resp = await authService.signup(req.body);
      res.cookie("token", resp.accessToken, cookieOptions);
      return res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const resp = await authService.login(req.body);
      res.cookie("token", resp.accessToken, cookieOptions);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token", cookieOptions);
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("User not authenticated", 401));
      }

      return res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
