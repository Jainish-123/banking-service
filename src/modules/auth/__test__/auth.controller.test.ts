import { Request, Response, NextFunction } from "express";
import authController from "../auth.controller";
import authService from "../auth.service";

jest.mock("../auth.service");

describe("AuthController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    name: "jainish patel",
    email: "jainish@gmail.com",
    role: "USER" as const,
  };

  describe("signup", () => {
    it("should return 201 and response returned from service", async () => {
      const mockRes = {
        accessToken: "accessToken",
        user: mockUser,
      };

      (authService.signup as jest.Mock).mockResolvedValue(mockRes);

      req.body = {
        name: "jainish patel",
        email: "jainish@gmail.com",
        password: "abcd1234",
      };

      await authController.signUp(req as Request, res as Response, next);

      expect(authService.signup).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (authService.signup as jest.Mock).mockRejectedValue(error);

      await authController.signUp(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("should return 200 and response returned from service", async () => {
      const mockRes = { accessToken: "accesToken", user: mockUser };
      (authService.login as jest.Mock).mockResolvedValue(mockRes);

      req.body = {
        email: "jainish@gmail.com",
        password: "abcd1234",
      };

      await authController.login(req as Request, res as Response, next);

      expect(authService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRes);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (authService.login as jest.Mock).mockRejectedValue(error);

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getMe", () => {
    it("should return 200 with user if authenticated", async () => {
      req.user = mockUser;

      await authController.getMe(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser,
      });
    });

    it("should call next with error if user is not authenticated", async () => {
      req.user = undefined;

      await authController.getMe(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User not authenticated",
          statusCode: 401,
        })
      );
    });
  });

  describe("logout", () => {
    it("should clear the cookie and return success message", async () => {
      await authController.logout(req as Request, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith("token", expect.anything());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logged out successfully",
      });
    });

    it("should call next with error if something fails", async () => {
      res.clearCookie = jest.fn(() => {
        throw new Error("clear cookie failed");
      });

      await authController.logout(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
