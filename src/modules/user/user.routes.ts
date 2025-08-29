import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { createUserSchema, getUserByIdSchema } from "./user.validate";
import userController from "./user.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User managemnet endpoints
 */

/**
 * @swagger
 * /api/users/create-user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: abc123#
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

router.post(
  "/create-user",
  validate(createUserSchema),
  userController.createUser
);

/**
 * @swagger
 * /api/users/get-all-users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
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

router.get("/get-all-users", userController.getAllUsers);

/**
 * @swagger
 * /api/users/get-user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
