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
    const newBalance = account.balance.add(Decimal(data.amount));
    const update = await prisma.account.update({
      where: { id: account.id },
      data: { balance: newBalance },
    });

    const transaction = await prisma.transaction.create({
      data: {
        type: TransactionType.DEPOSIT,
        amount: new Decimal(data.amount),
        status: TransactionStatus.SUCCESS,
        description: data.description,
        balanceAfter: newBalance,
        accountId: data.accountId,
        userId: user?.id,
      },
    });

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
