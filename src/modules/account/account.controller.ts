import { Request, Response, NextFunction } from "express";
import accountService from "./account.service";
import { getAccountByNumberSchema } from "./account.validate";

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
}
export default new AccountController();
