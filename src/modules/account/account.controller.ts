import { Request, Response, NextFunction } from "express";
import accountService from "./account.service";
import {
  getAccountByNumberSchema,
  getAccountsByUserIdSchema,
} from "./account.validate";

class AccountController {
  async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await accountService.createAccount(req.body);
      return res.status(201).json(account);
    } catch (error) {
      next(error);
    }
  }

  async getAccountDetailsByNumber(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { accountNumber } = getAccountByNumberSchema.parse({
        params: req.params,
      }).params;

      const account = await accountService.getAccountDetailsByNumber(
        { accountNumber },
        req.user
      );
      if (account) {
        res.status(200).json(account);
      }
    } catch (error) {
      next(error);
    }
  }

  async getAccountsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = getAccountsByUserIdSchema.parse({
        params: req.params,
      }).params;

      const accounts = await accountService.getAccountsByUserId({ id });
      if (accounts) {
        res.status(200).json(accounts);
      }
    } catch (error) {
      next(error);
    }
  }
}
export default new AccountController();
