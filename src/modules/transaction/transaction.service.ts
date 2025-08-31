import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/errorHandler";
import { TransactionResponse } from "./transaction.model";
import {
  TransactionInput,
  GetTransactionByIdInput,
  GetTransactionsByAccountIdInput,
} from "./transaction.validate";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { Request } from "express";

class TransactionService {
  async deposit(
    data: TransactionInput,
    user: Request["user"]
  ): Promise<TransactionResponse> {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }
    const account = await prisma.account.findUnique({
      where: { id: data.accountId },
    });
    if (!account) {
      throw new AppError("Account not exists", 400);
    }

    const depositAmmount = new Decimal(data.amount);
    const newBalance = account.balance.add(depositAmmount);

    const [updatedAccount, transaction] = await prisma.$transaction([
      prisma.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      }),
      prisma.transaction.create({
        data: {
          type: TransactionType.WITHDRAW,
          amount: depositAmmount,
          status: TransactionStatus.SUCCESS,
          description: data.description ?? undefined,
          balanceAfter: newBalance,
          accountId: account.id,
          userId: user.id,
        },
      }),
    ]);

    return {
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      status: transaction.status,
      description: transaction.description ?? undefined,
      balanceAfter: Number(transaction.balanceAfter),
      accountId: transaction.accountId,
      accountNumber: account.accountNumber,
      userId: user.id,
    };
  }

  async withdraw(
    data: TransactionInput,
    user: Request["user"]
  ): Promise<TransactionResponse> {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }
    const account = await prisma.account.findUnique({
      where: { id: data.accountId },
    });
    if (!account) {
      throw new AppError("Account not exists", 400);
    }
    if (user.id !== account.userId) {
      throw new AppError(
        "Forbidden: cannot withdraw from other's account",
        403
      );
    }
    const withdrawAmount = new Decimal(data.amount);
    if (account.balance.lt(withdrawAmount)) {
      const transaction = await prisma.transaction.create({
        data: {
          type: TransactionType.WITHDRAW,
          amount: withdrawAmount,
          status: TransactionStatus.FAILED,
          description: data.description ?? undefined,
          balanceAfter: account.balance,
          accountId: data.accountId,
          userId: user.id,
        },
      });

      throw new AppError("Not sufficient balance", 400);
    }

    const newBalance = account.balance.sub(withdrawAmount);
    const [updatedAccount, transaction] = await prisma.$transaction([
      prisma.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      }),
      prisma.transaction.create({
        data: {
          type: TransactionType.WITHDRAW,
          amount: withdrawAmount,
          status: TransactionStatus.SUCCESS,
          description: data.description ?? undefined,
          balanceAfter: newBalance,
          accountId: account.id,
          userId: user.id,
        },
      }),
    ]);

    return {
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      status: transaction.status,
      description: transaction.description ?? undefined,
      balanceAfter: Number(transaction.balanceAfter),
      accountId: transaction.accountId,
      accountNumber: account.accountNumber,
      userId: user.id,
    };
  }

  async getTransactionById(
    data: GetTransactionByIdInput,
    user: Request["user"]
  ): Promise<TransactionResponse> {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: data.id },
    });

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    if (transaction.userId !== user?.id && user?.role !== "ADMIN") {
      throw new AppError("Forbidden", 403);
    }

    const account = await prisma.account.findUnique({
      where: { id: transaction.accountId },
    });

    if (!account) {
      throw new AppError("Account not exist for this transaction", 400);
    }

    return {
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      status: transaction.status,
      description: transaction.description ?? undefined,
      balanceAfter: Number(transaction.balanceAfter),
      accountId: transaction.accountId,
      accountNumber: account.accountNumber,
      userId: user.id,
    };
  }

  async getTransactionsByAccountId(
    data: GetTransactionsByAccountIdInput,
    user: Request["user"]
  ): Promise<TransactionResponse[]> {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const account = await prisma.account.findUnique({
      where: { id: data.accountId },
    });

    if (!account) {
      throw new AppError("Account not exist for this transaction", 400);
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: data.accountId,
        ...(user.role !== "ADMIN" && { userId: user.id }),
      },
    });

    if (!transactions || transactions.length == 0) {
      throw new AppError("Transactions not exists for this account/user", 404);
    }

    return transactions.map((transaction: Transaction) => ({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      status: transaction.status,
      description: transaction.description ?? undefined,
      balanceAfter: Number(transaction.balanceAfter),
      accountId: transaction.accountId,
      accountNumber: account.accountNumber,
      userId: user.id,
    }));
  }
}

export default new TransactionService();
