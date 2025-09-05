import { z } from "zod";

export const transactionSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    accountId: z.number().int().positive(),
    description: z.string().optional(),
  }),
});

export const getTransactionByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: "Id must be a valid number",
      }),
  }),
});

export const getTransactionsByAccountIdSchema = z.object({
  params: z.object({
    accountId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: "Id must be a valid number",
      }),
  }),
});

export type TransactionInput = z.infer<typeof transactionSchema>["body"];
export type GetTransactionByIdInput = z.infer<
  typeof getTransactionByIdSchema
>["params"];
export type GetTransactionsByAccountIdInput = z.infer<
  typeof getTransactionsByAccountIdSchema
>["params"];
