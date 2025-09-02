import { z } from "zod";

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: "Id must be a valid number",
      }),
  }),
});

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>["params"];
