import { Request, Response, NextFunction } from "express";
import accountService from "./account.service";

class AccountController {
  async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await accountService.createAccount(req.body);
      return res.status(201).json(account);
    } catch (error) {
      next(error);
    }
  }
}
export default new AccountController();
