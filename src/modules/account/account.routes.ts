import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { createAccountSchema } from "./account.validate";
import { matchUserId, requireAuth } from "../../middlewares/auth";
import accountController from "./account.controller";

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account
 */

const router = Router();

/**
 * @swagger
 * /api/account/create:
 *   post:
 *     summary: create account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountDTO'
 *     responses:
 *       201:
 *         description: Account created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post(
  "/create",
  validate(createAccountSchema),
  requireAuth,
  matchUserId,
  accountController.createAccount
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAccountDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         balance:
 *           type: number
 *           format: decimal
 *           example: 100.00
 *         accountType:
 *           type: string
 *           enum: ["SAVINGS", "CHECKING", "CREDIT", "LOAN"]
 *           example: SAVINGS
 *         isPrimary:
 *           type: boolean
 *           example: true
 */
