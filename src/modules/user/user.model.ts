import { prisma } from "../../lib/prisma";

export type UserModel = Awaited<ReturnType<typeof prisma.user.findUnique>>;

export interface UserDTO {
  id: number;
  name: string;
  email: string;
}
