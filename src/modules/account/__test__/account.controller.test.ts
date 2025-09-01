import { Request, Response, NextFunction } from "express";
import accountController from "../account.controller";
import accountService from "../account.service";
import { AppError } from "../../../middlewares/errorHandler";

jest.mock("../account.service");

describe("AccountController", () => {
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

  const mockAccount = {
    id: 10,
    userId: 1,
    accountNumber: "ACC-1-12345",
    accountType: "SAVINGS",
    balance: 100.0,
    isPrimary: false,
  };

  describe("createAccount", () => {
    it("should return 201 and response returned from service", async () => {
      const mockRes = mockAccount;
      (accountService.createAccount as jest.Mock).mockResolvedValue(mockRes);

      req.body = {
        userId: 1,
        balance: 100.0,
        accountType: "SAVINGS",
        isPrimary: false,
      };

      await accountController.createAccount(
        req as Request,
        res as Response,
        next
      );

      expect(accountService.createAccount).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (accountService.createAccount as jest.Mock).mockRejectedValue(error);

      req.body = {
        userId: 1,
        balance: 100.0,
        accountType: "SAVINGS",
        isPrimary: false,
      };

      await accountController.createAccount(
        req as Request,
        res as Response,
        next
      );

      expect(accountService.createAccount).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAccountDetailsByNumber", () => {
    it("should return 200 and response returned from service", async () => {
      const mockRes = mockAccount;
      (accountService.getAccountDetailsByNumber as jest.Mock).mockResolvedValue(
        mockRes
      );
      req.params = { accountNumber: "ACC-1-12345" };
      req.user = { id: 1, role: "USER" as const };

      await accountController.getAccountDetailsByNumber(
        req as Request,
        res as Response,
        next
      );

      expect(accountService.getAccountDetailsByNumber).toHaveBeenCalledWith(
        req.params,
        req.user
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (accountService.getAccountDetailsByNumber as jest.Mock).mockRejectedValue(
        error
      );

      req.params = { accountNumber: "ACC-1-12345" };
      req.user = { id: 1, role: "USER" as const };

      await accountController.getAccountDetailsByNumber(
        req as Request,
        res as Response,
        next
      );

      expect(accountService.getAccountDetailsByNumber).toHaveBeenCalledWith(
        req.params,
        req.user
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAccountsByUserId", () => {
    it("should return 200 and response returned from service", async () => {
      const mockRes = [mockAccount];
      (accountService.getAccountsByUserId as jest.Mock).mockResolvedValue(
        mockRes
      );
      req.params = { id: "1" };

      await accountController.getAccountsByUserId(
        req as Request,
        res as Response,
        next
      );

      expect(accountService.getAccountsByUserId).toHaveBeenCalledWith({
        id: 1,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (accountService.getAccountsByUserId as jest.Mock).mockRejectedValue(
        error
      );

      req.params = { id: "1" };

      await accountController.getAccountsByUserId(
        req as Request,
        res as Response,
        next
      );

      expect(accountService.getAccountsByUserId).toHaveBeenCalledWith({
        id: 1,
      });

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
