import { Request, Response, NextFunction } from "express";
import userService from "./user.service";
import { getUserByIdSchema } from "./user.validate";

class UserController {
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = await userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const parsed = getUserByIdSchema.parse({ params: req.params });
      const { id } = parsed.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      } else {
        return res.status(200).json(user);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
