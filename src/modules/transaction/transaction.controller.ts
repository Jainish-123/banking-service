import { Request, Response, NextFunction } from "express";
import transactionService from "./transaction.service";
import { AppError } from "../../middlewares/errorHandler";

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
}

export default new TransactionController();
