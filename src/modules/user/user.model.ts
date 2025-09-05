import { prisma } from "../../lib/prisma";

export type UserModel = Awaited<ReturnType<typeof prisma.user.findUnique>>;

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}
