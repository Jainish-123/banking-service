import { Request, Response, NextFunction } from "express";
import transactionService from "../transaction.service";
import transactionController from "../transaction.controller";

jest.mock("../transaction.service");

describe("TransactionVontroller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deposit", () => {
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

    it("should return 201 and response returned from service", async () => {
      const mockRes = mockDepositTransaction;
      (transactionService.deposit as jest.Mock).mockResolvedValue(mockRes);

      req.body = {
        amount: 100.0,
        accountId: 10,
      };
      req.user = { id: 1, role: "USER" as const };

      await transactionController.deposit(
        req as Request,
        res as Response,
        next
      );

      expect(transactionService.deposit).toHaveBeenCalledWith(
        req.body,
        req.user
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (transactionService.deposit as jest.Mock).mockRejectedValue(error);

      req.body = {
        amount: 100.0,
        accountId: 10,
      };
      req.user = { id: 1, role: "USER" as const };

      await transactionController.deposit(
        req as Request,
        res as Response,
        next
      );

      expect(transactionService.deposit).toHaveBeenCalledWith(
        req.body,
        req.user
      );
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("withdraw", () => {
    const mockWithdrawTransaction = {
      id: 2,
      type: "WITHDRAW" as const,
      amount: 100.0,
      status: "SUCCESS" as const,
      balanceAfter: 50.0,
      accountId: 10,
      accountNumber: "ACC-1-12345",
      userId: 1,
    };

    it("should return 201 and response returned from service", async () => {
      const mockRes = mockWithdrawTransaction;
      (transactionService.withdraw as jest.Mock).mockResolvedValue(mockRes);

      req.body = {
        amount: 50.0,
        accountId: 10,
      };
      req.user = { id: 1, role: "USER" as const };

      await transactionController.withdraw(
        req as Request,
        res as Response,
        next
      );

      expect(transactionService.withdraw).toHaveBeenCalledWith(
        req.body,
        req.user
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (transactionService.withdraw as jest.Mock).mockRejectedValue(error);

      req.body = {
        amount: 200.0,
        accountId: 10,
      };
      req.user = { id: 1, role: "USER" as const };

      await transactionController.withdraw(
        req as Request,
        res as Response,
        next
      );

      expect(transactionService.withdraw).toHaveBeenCalledWith(
        req.body,
        req.user
      );
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getTransactionById", () => {
    const mockTransaction = {
      id: 1,
      type: "DEPOSIT" as const,
      amount: 100.0,
      status: "SUCCESS" as const,
      balanceAfter: 200.0,
      accountId: 10,
      accountNumber: "ACC-1-12345",
      userId: 1,
    };

    it("should return 200 and response returned from service", async () => {
      const mockRes = mockTransaction;
      (transactionService.getTransactionById as jest.Mock).mockResolvedValue(
        mockRes
      );
      req.params = { id: "1" };
      req.user = { id: 1, role: "USER" as const };

      await transactionController.getTransactionById(
        req as Request,
        res as Response,
        next
      );

      expect(transactionService.getTransactionById).toHaveBeenCalledWith(
        { id: 1 },
        req.user
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (transactionService.getTransactionById as jest.Mock).mockRejectedValue(
        error
      );

      req.params = { id: "1" };
      req.user = { id: 1, role: "USER" as const };

      await transactionController.getTransactionById(
        req as Request,
        res as Response,
        next
      );

      expect(transactionService.getTransactionById).toHaveBeenCalledWith(
        { id: 1 },
        req.user
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getTransactionsByAccountId", () => {
    const mockTransactions = [
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

    it("should return 200 and response returned from service", async () => {
      const mockRes = mockTransactions;
      (
        transactionService.getTransactionsByAccountId as jest.Mock
      ).mockResolvedValue(mockRes);
      req.params = { accountId: "1" };
      req.user = { id: 1, role: "USER" as const };

      await transactionController.getTransactionsByAccountId(
        req as Request,
        res as Response,
        next
      );

      expect(
        transactionService.getTransactionsByAccountId
      ).toHaveBeenCalledWith({ accountId: 1 }, req.user);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (
        transactionService.getTransactionsByAccountId as jest.Mock
      ).mockRejectedValue(error);

      req.params = { accountId: "1" };
      req.user = { id: 1, role: "USER" as const };

      await transactionController.getTransactionsByAccountId(
        req as Request,
        res as Response,
        next
      );

      expect(
        transactionService.getTransactionsByAccountId
      ).toHaveBeenCalledWith({ accountId: 1 }, req.user);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
