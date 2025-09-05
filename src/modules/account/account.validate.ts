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

export const getAccountsByUserIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: "Id must be a valid number",
      }),
  }),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>["body"];
export type GetAccountByNumberInput = z.infer<
  typeof getAccountByNumberSchema
>["params"];
export type GetAccountByUserIdInput = z.infer<
  typeof getAccountsByUserIdSchema
>["params"];
