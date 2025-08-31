import { TransactionStatus, TransactionType } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export type TransactionModel = Awaited<
  ReturnType<typeof prisma.transaction.findUnique>
>;

export interface TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  desciption?: string;
  balanceAfter: number;
  accountId: number;
  accountNumber: string;
  userId: number;
}
