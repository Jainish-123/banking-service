import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authService from "../auth.service";
import { AppError } from "../../../middlewares/errorHandler";

jest.mock("../../../lib/prisma", () => ({
  __esModule: true,
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("AuthService", () => {
  const mockUser = {
    id: 1,
    name: "jainish patel",
    email: "jainish@gmail.com",
    password: "hashedPassword",
    role: "USER" as const,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should create user and return access token", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("accessToken");

      const result = await authService.signup({
        name: "jainish patel",
        email: "jainish@gmail.com",
        password: "abcd1234",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "jainish@gmail.com" },
      });

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result.accessToken).toBe("accessToken");
      expect(result.user.email).toBe("jainish@gmail.com");
    });

    it("should through error if user exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      await expect(
        authService.signup({
          name: "jainish patel",
          email: "jainish@gmail.com",
          password: "abcd1234",
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("login", () => {
    it("should return access toekn if credentials are valid", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(
        async (password, hash) => {
          console.log(
            `bcrypt.compare called with password=${password}, hash=${hash}`
          );
          return true;
        }
      );
      (jwt.sign as jest.Mock).mockReturnValue("accessToken");

      const result = await authService.login({
        email: "jainish@gmail.com",
        password: "abcd1234",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "jainish@gmail.com" },
      });
      expect(result.accessToken).toBe("accessToken");
      expect(result.user.email).toBe("jainish@gmail.com");
    });

    it("should throw error if user not exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: "other@gmail.com", password: "abcd1234" })
      ).rejects.toThrow(AppError);
    });

    it("should throw error if password not matched", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: "jainish@gmail.com", password: "hello1234" })
      ).rejects.toThrow(AppError);
    });
  });

  describe("signToken", () => {
    it("should call sign token function with user id and role", () => {
      (jwt.sign as jest.Mock).mockReturnValue("accessToken");

      const result = (authService as any).signToken(1, "USER");

      expect(jwt.sign).toHaveBeenCalledWith(
        { role: "USER" },
        expect.any(String),
        expect.objectContaining({ subject: "1" })
      );

      expect(result).toBe("accessToken");
    });
  });
});
