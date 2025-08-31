import { z } from "zod";
export const createAccountSchema = z.object({
  body: z.object({
    userId: z.number().int().positive(),
    balance: z.number().positive(),
    accountType: z.enum(["SAVINGS", "CHECKING", "CREDIT", "LOAN"]).optional(),
    isPrimary: z.boolean().optional(),
  }),
});

export const getAccountByNumberSchema = z.object({
  params: z.object({
    accountNumber: z.string(),
  }),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>["body"];
export type GetAccountByNumberInput = z.infer<
  typeof getAccountByNumberSchema
>["params"];
