import { AccountStatus, AccountType } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export type AccountModel = Awaited<
  ReturnType<typeof prisma.account.findUnique>
>;

export interface AccountDTO {
  userId: number;
  balance: number;
  accountType?: AccountType;
  isPrimary?: boolean;
}

export interface CreateAccountResponse {
  accountId: number;
  accountNumber: string;
  userId: number;
  balance: number;
  accountType?: AccountType;
  status?: AccountStatus;
  isPrimary?: boolean;
}
