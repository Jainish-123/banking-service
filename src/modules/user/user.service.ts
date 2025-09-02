import { prisma } from "../../lib/prisma";
import { UserResponse } from "./user.model";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { GetUserByIdInput } from "./user.validate";
import { AppError } from "../../middlewares/errorHandler";

class UserService {
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany();

    if (!users || users.length == 0) {
      throw new AppError("Users not found", 404);
    }

    return users.map((user: User) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }

  async getUserById(data: GetUserByIdInput): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({ where: { id: data.id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export default new UserService();
