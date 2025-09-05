import { multipleOf } from "zod";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../middlewares/errorHandler";
import transactionService from "../transaction.service";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock("../../../lib/prisma", () => ({
  __esModule: true,
  prisma: {
    account: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("TransactionService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    id: 10,
    userId: 1,
    accountNumber: "ACC-1-12345",
    accountType: "SAVINGS",
    balance: new Decimal(100.0),
    isPrimary: false,
  };

  const mockUser = { id: 1, role: "USER" as const };

  describe("deposit", () => {
    const input = {
      amount: 100.0,
      accountId: 10,
    };

    it("should deposit successfully and return transaction information in response", async () => {
      const mockDepositTransaction = {
        id: 1,
        type: "DEPOSIT" as const,
        amount: 100.0,
        status: "SUCCESS" as const,
        balanceAfter: 200.0,
        accountId: 10,
        accountNumber: "ACC-1-12345",
        userId: 1,
      };

      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (prisma.transaction.create as jest.Mock).mockResolvedValue(
        mockDepositTransaction
      );
      (prisma.$transaction as jest.Mock).mockResolvedValue([
        mockAccount,
        mockDepositTransaction,
      ]);

      const result = await transactionService.deposit(input, mockUser);

      expect(prisma.account.findUnique).toHaveBeenCalled();
      expect(prisma.transaction.create).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();

      expect(result).toEqual(mockDepositTransaction);
    });

    it("should throw Unauthorized error if user is not logged in", async () => {
      await expect(
        transactionService.deposit(input, undefined)
      ).rejects.toThrow(AppError);
    });

    it("should throw error if account not found", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(transactionService.deposit(input, mockUser)).rejects.toThrow(
        AppError
      );

      expect(prisma.account.findUnique).toHaveBeenCalled();
    });
  });

  describe("withdraw", () => {
    const input = {
      amount: 100.0,
      accountId: 10,
    };

    it("should withdraw successfully and return transaction information in response", async () => {
      const mockWithdrawTransaction = {
        id: 2,
        type: "WITHDRAW" as const,
        amount: 20.0,
        status: "SUCCESS" as const,
        balanceAfter: 180.0,
        accountId: 10,
        accountNumber: "ACC-1-12345",
        userId: 1,
      };

      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (prisma.transaction.create as jest.Mock).mockResolvedValue(
        mockWithdrawTransaction
      );
      (prisma.$transaction as jest.Mock).mockResolvedValue([
        mockAccount,
        mockWithdrawTransaction,
      ]);

      const result = await transactionService.withdraw(input, mockUser);

      expect(prisma.account.findUnique).toHaveBeenCalled();
      expect(prisma.transaction.create).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();

      expect(result).toEqual(mockWithdrawTransaction);
    });

    it("should throw Unauthorized error if user is not logged in", async () => {
      await expect(
        transactionService.withdraw(input, undefined)
      ).rejects.toThrow(AppError);
    });

    it("should throw error if account not found", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        transactionService.withdraw(input, mockUser)
      ).rejects.toThrow(AppError);

      expect(prisma.account.findUnique).toHaveBeenCalled();
    });

    it("should throw forbidden if user is not account owner", async () => {
      const otherAccount = {
        id: 10,
        userId: 2,
        balance: new Decimal(200),
        accountNumber: "ACC-1-12345",
        isPrimary: false,
      };

      (prisma.account.findUnique as jest.Mock).mockResolvedValue(otherAccount);

      await expect(
        transactionService.withdraw(input, mockUser)
      ).rejects.toThrow(AppError);

      expect(prisma.account.findUnique).toHaveBeenCalled();
    });

    it("should throw error if insufficient balance", async () => {
      const newInput = {
        amount: 150.0,
        accountId: 10,
      };

      const mockWithdrawTransaction = {
        id: 3,
        type: "WITHDRAW" as const,
        amount: 150.0,
        status: "FAILED" as const,
        balanceAfter: 100.0,
        accountId: 10,
        accountNumber: "ACC-1-12345",
        userId: 1,
      };

      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (prisma.transaction.create as jest.Mock).mockResolvedValue(
        mockWithdrawTransaction
      );
      (prisma.$transaction as jest.Mock).mockResolvedValue([
        mockAccount,
        mockWithdrawTransaction,
      ]);

      await expect(
        transactionService.withdraw(newInput, mockUser)
      ).rejects.toThrow(AppError);

      expect(prisma.account.findUnique).toHaveBeenCalled();
      expect(prisma.transaction.create).toHaveBeenCalled();
      //   expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe("getTransactionById", () => {
    const transaction = {
      id: 1,
      type: "DEPOSIT" as const,
      amount: 100.0,
      status: "SUCCESS" as const,
      balanceAfter: 200.0,
      accountId: 10,
      accountNumber: "ACC-1-12345",
      userId: 1,
    };

    it("should return transaction for owner", async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(
        transaction
      );
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      const result = await transactionService.getTransactionById(
        { id: 1 },
        mockUser
      );

      expect(prisma.transaction.findUnique).toHaveBeenCalled();
      expect(prisma.account.findUnique).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.accountNumber).toBe("ACC-1-12345");
    });

    it("should throw Unauthorized error if user is not logged in", async () => {
      await expect(
        transactionService.getTransactionById({ id: 1 }, undefined)
      ).rejects.toThrow(AppError);
    });

    it("should throw error if transaction not found", async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        transactionService.getTransactionById({ id: 2 }, mockUser)
      ).rejects.toThrow(AppError);

      expect(prisma.transaction.findUnique).toHaveBeenCalled();
    });

    it("should allow admin to access others' transactions", async () => {
      const admin = { id: 2, role: "ADMIN" as const };

      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(
        transaction
      );
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      const result = await transactionService.getTransactionById(
        { id: 1 },
        admin
      );

      expect(prisma.transaction.findUnique).toHaveBeenCalled();
      expect(prisma.account.findUnique).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.userId).toBe(2);
      expect(result.accountNumber).toBe("ACC-1-12345");
    });

    it("should throw forbidden to access others' transactions", async () => {
      const otherUser = { id: 2, role: "USER" as const };

      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(
        transaction
      );
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      await expect(
        transactionService.getTransactionById({ id: 1 }, otherUser)
      ).rejects.toThrow(AppError);

      expect(prisma.transaction.findUnique).toHaveBeenCalled();
    });
  });

  describe("getTransactionsByAccountId", () => {
    const transactions = [
      {
        id: 1,
        type: "DEPOSIT" as const,
        amount: 100.0,
        status: "SUCCESS" as const,
        balanceAfter: 200.0,
        accountId: 10,
        accountNumber: "ACC-1-12345",
        userId: 1,
      },
    ];

    it("should return transactions for owner", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(
        transactions
      );

      const result = await transactionService.getTransactionsByAccountId(
        { accountId: 1 },
        mockUser
      );

      expect(prisma.account.findUnique).toHaveBeenCalled();
      expect(prisma.transaction.findMany).toHaveBeenCalled();

      expect(result[0].id).toBe(1);
      expect(result[0].accountNumber).toBe("ACC-1-12345");
    });

    it("should throw Unauthorized error if user is not logged in", async () => {
      await expect(
        transactionService.getTransactionsByAccountId(
          { accountId: 10 },
          undefined
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw error if account not found", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        transactionService.getTransactionsByAccountId(
          { accountId: 1 },
          mockUser
        )
      ).rejects.toThrow(AppError);

      expect(prisma.account.findUnique).toHaveBeenCalled();
    });

    it("should throw error if transaction not found", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);

      await expect(
        transactionService.getTransactionsByAccountId(
          { accountId: 10 },
          mockUser
        )
      ).rejects.toThrow(AppError);

      expect(prisma.account.findUnique).toHaveBeenCalled();
      expect(prisma.transaction.findMany).toHaveBeenCalled();
    });
  });
});
