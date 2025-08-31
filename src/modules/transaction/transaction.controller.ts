import { Request, Response, NextFunction } from "express";
import transactionService from "./transaction.service";
import { AppError } from "../../middlewares/errorHandler";
import {
  getTransactionByIdSchema,
  getTransactionsByAccountIdSchema,
} from "./transaction.validate";

class TransactionController {
  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.deposit(req.body, req.user);
      if (!transaction) {
        return next(new AppError("Money was not deposited", 400));
      }

      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.withdraw(req.body, req.user);
      if (!transaction) {
        return next(new AppError("Money was not withdrawn", 400));
      }

      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = getTransactionByIdSchema.parse({
        params: req.params,
      }).params;

      const transaction = await transactionService.getTransactionById(
        { id },
        req.user
      );

      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionsByAccountId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { accountId } = getTransactionsByAccountIdSchema.parse({
        params: req.params,
      }).params;

      const transactions = await transactionService.getTransactionsByAccountId(
        { accountId },
        req.user
      );

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
