import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/errorHandler";
import { AuthResponse } from "./auth.model";
import { LoginInput, SignupInput } from "./auth.validate";
import bcrypt from "bcrypt";
import { env } from "../../config/env";
import jwt, { SignOptions } from "jsonwebtoken";

class AuthService {
  async signup(data: SignupInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("User exists with email", 409);
    }

    const password = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password, role: "USER" },
    });

    const accessToken = this.signToken(user.id, user.role);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new AppError("Invalid Credentials", 401);
    }

    const passwordCompare = await bcrypt.compare(data.password, user.password);

    if (!passwordCompare) {
      throw new AppError("Invalid Credentials", 401);
    }

    const accessToken = this.signToken(user.id, user.role);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private signToken(sub: number, role: "USER" | "ADMIN") {
    const options: SignOptions = {
      subject: String(sub),
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    };

    return jwt.sign({ role }, env.JWT_SECRET, options);
  }
}

export default new AuthService();
