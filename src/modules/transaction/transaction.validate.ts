import { z } from "zod";

export const transactionSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    accountId: z.number().int().positive(),
    description: z.string().optional(),
  }),
});

export type TransactionInput = z.infer<typeof transactionSchema>["body"];
