import { prisma } from "../../lib/prisma";
import { UserDTO } from "./user.model";
import bcrypt from "bcryptjs";

class UserService {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserDTO> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await prisma.user.findMany();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }

  async getUserById(id: number): Promise<UserDTO | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export default new UserService();
