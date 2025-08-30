import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { createUserSchema, getUserByIdSchema } from "./user.validate";
import userController from "./user.controller";
import {
  requireAuth,
  requireRole,
  requireSelfOrAdmin,
} from "../../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User managemnet endpoints
 */

/**
 * @swagger
 * /api/users/get-all-users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDTO'
 *       500:
 *         description: Internal server error
 */

router.get(
  "/get-all-users",
  requireAuth,
  requireRole("ADMIN"),
  userController.getAllUsers
);

/**
 * @swagger
 * /api/users/get-user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: User id
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/get-user/:id",
  validate(getUserByIdSchema),
  requireAuth,
  requireSelfOrAdmin("id"),
  userController.getUserById
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 */
