import { Request, Response, NextFunction } from "express";
import userService from "../user.service";
import userController from "../user.controller";

jest.mock("../user.service");

describe("UserController", () => {
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

  const mockUser = {
    id: 1,
    name: "Jainish",
    email: "jainish@gmail.com",
  };

  describe("getAllUsers", () => {
    it("should return 200 and response returned from service", async () => {
      (userService.getAllUsers as jest.Mock).mockResolvedValue([mockUser]);

      await userController.getAllUsers(req as Request, res as Response, next);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockUser]);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (userService.getAllUsers as jest.Mock).mockRejectedValue(error);

      await userController.getAllUsers(req as Request, res as Response, next);

      expect(userService.getAllUsers).toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserById", () => {
    it("should return 200 and response returned from service", async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      req.params = { id: "1" };

      await userController.getUserById(req as Request, res as Response, next);

      expect(userService.getUserById).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next/error_handler with error if service throws that error", async () => {
      const error = new Error("error from service");
      (userService.getUserById as jest.Mock).mockRejectedValue(error);

      req.params = { id: "1" };

      await userController.getUserById(req as Request, res as Response, next);

      expect(userService.getUserById).toHaveBeenCalledWith({ id: 1 });

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
