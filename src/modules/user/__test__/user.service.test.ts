import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../middlewares/errorHandler";
import userService from "../user.service";

jest.mock("../../../lib/prisma", () => ({
  __esModule: true,
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    name: "Jainish",
    email: "jainish@gmail.com",
  };

  describe("getAllUsers", () => {
    it("should return users", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);
      const result = await userService.getAllUsers();
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should throw error if users not found", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      await expect(userService.getAllUsers()).rejects.toThrow(AppError);

      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return user", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const result = await userService.getUserById({ id: 1 });

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById({ id: 2 })).rejects.toThrow(
        AppError
      );

      expect(prisma.user.findUnique).toHaveBeenCalled();
    });
  });
});
