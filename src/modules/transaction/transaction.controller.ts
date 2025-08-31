import { Request, Response, NextFunction } from "express";
import transactionService from "./transaction.service";
import { AppError } from "../../middlewares/errorHandler";

class TransactionController {
  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.deposit(req.body, req.user);
      if (!transaction) {
        return next(new AppError("Transaction could not be created", 400));
      }

      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
