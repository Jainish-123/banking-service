import accountService from "../account.service";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../middlewares/errorHandler";

jest.mock("../../../lib/prisma", () => ({
  __esModule: true,
  prisma: {
    account: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("AccountService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    id: 10,
    userId: 1,
    accountNumber: "ACC-1-12345",
    accountType: "SAVINGS",
    balance: 100.0,
    isPrimary: false,
  };

  it("should create the account and return account information in response", async () => {
    const input = {
      userId: 1,
      balance: 100.0,
      accountType: "SAVINGS" as const,
      isPrimary: false,
    };

    (prisma.account.create as jest.Mock).mockResolvedValue(mockAccount);

    const result = await accountService.createAccount(input);

    expect(prisma.account.create).toHaveBeenCalled();

    expect(result).toEqual({
      accountId: mockAccount.id,
      userId: mockAccount.userId,
      accountNumber: mockAccount.accountNumber,
      accountType: mockAccount.accountType,
      balance: mockAccount.balance,
      isPrimary: mockAccount.isPrimary,
    });
  });

  describe("getAccountDetailsByNumber", () => {
    const mockUser = { id: 1, role: "USER" as const };

    it("should return account details from account number when user owns that account", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      const result = await accountService.getAccountDetailsByNumber(
        {
          accountNumber: "ACC-1-12345",
        },
        mockUser
      );

      expect(prisma.account.findUnique).toHaveBeenCalled();
      expect(result.userId).toBe(1);
      expect(result.accountNumber).toBe("ACC-1-12345");
    });

    it("should throw forbidden if user does not own account and is not ADMIN", async () => {
      const otherMockAccount = {
        id: 20,
        userId: 2,
        accountNumber: "ACC-2-12345",
        accountType: "SAVINGS",
        balance: 500,
        isPrimary: true,
      };

      (prisma.account.findUnique as jest.Mock).mockResolvedValue(
        otherMockAccount
      );

      await expect(
        accountService.getAccountDetailsByNumber(
          {
            accountNumber: "ACC-2-12345",
          },
          mockUser
        )
      ).rejects.toThrow(AppError);
    });

    it("should allow ADMIN to access other user's account", async () => {
      const otherMockAccount = {
        id: 20,
        userId: 2,
        accountNumber: "ACC-2-12345",
        accountType: "SAVINGS",
        balance: 500,
        isPrimary: true,
      };

      (prisma.account.findUnique as jest.Mock).mockResolvedValue(
        otherMockAccount
      );

      const result = await accountService.getAccountDetailsByNumber(
        {
          accountNumber: "ACC-2-12345",
        },
        { id: 3, role: "ADMIN" as const }
      );

      expect(result.accountNumber).toBe("ACC-2-12345");
    });
  });

  describe("getAccountsByUserId", () => {
    it("should return account/s details for given user", async () => {
      (prisma.account.findMany as jest.Mock).mockResolvedValue([mockAccount]);

      const result = await accountService.getAccountsByUserId({ id: 1 });

      expect(prisma.account.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(1);
    });

    it("should throw error if no accounts exists for given user", async () => {
      (prisma.account.findMany as jest.Mock).mockResolvedValue([]);

      await expect(
        accountService.getAccountsByUserId({ id: 1 })
      ).rejects.toThrow("Account not found");
    });
  });
});
