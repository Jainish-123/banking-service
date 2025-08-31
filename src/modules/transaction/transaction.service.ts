import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/errorHandler";
import { TransactionResponse } from "./transaction.model";
import { TransactionInput } from "./transaction.validate";
import { TransactionStatus, TransactionType } from "@prisma/client";
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
      desciption: transaction.description ?? undefined,
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
      desciption: transaction.description ?? undefined,
      balanceAfter: Number(transaction.balanceAfter),
      accountId: transaction.accountId,
      accountNumber: account.accountNumber,
      userId: user.id,
    };
  }
}

export default new TransactionService();
