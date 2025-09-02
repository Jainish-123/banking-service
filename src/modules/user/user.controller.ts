import { Request, Response, NextFunction } from "express";
import userService from "./user.service";
import { getUserByIdSchema } from "./user.validate";
import { AppError } from "../../middlewares/errorHandler";

class UserController {
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const users = await userService.getAllUsers();
      if (!users) {
        return next(new AppError("Users not found", 404));
      }
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
      const { id } = getUserByIdSchema.parse({
        params: req.params,
      }).params;
      const user = await userService.getUserById({ id });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
