import { Request } from "express";
import { CreateAccountResponse } from "./account.model";
import {
  CreateAccountInput,
  GetAccountByNumberInput,
  GetAccountByUserIdInput,
} from "./account.validate";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/errorHandler";
import { Account } from "@prisma/client";

class AccountService {
  async createAccount(
    data: CreateAccountInput
  ): Promise<CreateAccountResponse> {
    const accountData: any = {
      userId: data.userId,
      balance: data.balance,
      accountNumber: `ACC-${data.userId}-${Date.now()}`,
    };

    if (data.accountType !== undefined) {
      accountData.accountType = data.accountType;
    }

    if (data.isPrimary !== undefined) {
      accountData.isPrimary = data.isPrimary;
    }

    const account = await prisma.account.create({
      data: accountData,
    });

    return {
      accountId: account.id,
      userId: account.userId,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: Number(account.balance),
      isPrimary: account.isPrimary,
    };
  }

  async getAccountDetailsByNumber(
    data: GetAccountByNumberInput,
    user: Request["user"]
  ): Promise<CreateAccountResponse> {
    const account = await prisma.account.findUnique({
      where: { accountNumber: data.accountNumber },
    });

    if (!account) {
      throw new AppError("Account not found", 404);
    }

    if (account.userId !== user?.id && user?.role !== "ADMIN") {
      throw new AppError("Forbidden", 403);
    }

    return {
      accountId: account.id,
      userId: account.userId,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: Number(account.balance),
      isPrimary: account.isPrimary,
    };
  }

  async getAccountsByUserId(
    data: GetAccountByUserIdInput
  ): Promise<CreateAccountResponse[]> {
    const accounts = await prisma.account.findMany({
      where: { userId: data.id },
    });

    if (!accounts || accounts.length == 0) {
      throw new AppError("Account not found", 404);
    }

    return accounts.map((account: Account) => ({
      accountId: account.id,
      userId: account.userId,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: Number(account.balance),
      isPrimary: account.isPrimary,
    }));
  }
}

export default new AccountService();
