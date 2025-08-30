import { Request, Response, NextFunction } from "express";
import authService from "./auth.service";

class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const resp = await authService.signup(req.body);
      return res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const resp = await authService.login(req.body);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
