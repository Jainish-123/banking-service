import { Request, Response, NextFunction } from "express";
import { AccountModel, CreateAccountResponse } from "./account.model";
import { CreateAccountInput } from "./account.validate";
import { prisma } from "../../lib/prisma";

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
}

export default new AccountService();
