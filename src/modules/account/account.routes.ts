import { Router } from "express";
import { validate } from "../../middlewares/validate";
import {
  createAccountSchema,
  getAccountByNumberSchema,
  getAccountsByUserIdSchema,
} from "./account.validate";
import {
  matchUserId,
  requireAuth,
  requireSelfOrAdmin,
} from "../../middlewares/auth";
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
 *             $ref: '#/components/schemas/AccountDTO'
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

/**
 * @swagger
 * /api/account/get-account/{accountNumber}:
 *   get:
 *     summary: Get account by account number
 *     tags: [Account]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: ACC-X-1756595377248
 *         description: Account number
 *     responses:
 *       200:
 *         description: Account found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountDTO'
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */

router.get(
  "/get-account/:accountNumber",
  validate(getAccountByNumberSchema),
  requireAuth,
  accountController.getAccountDetailsByNumber
);

/**
 * @swagger
 * /api/account/get-account-by-user/{id}:
 *   get:
 *     summary: Get account by user id
 *     tags: [Account]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: User Id
 *     responses:
 *       200:
 *         description: Account/s found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountDTO'
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */

router.get(
  "/get-account-by-user/:id",
  validate(getAccountsByUserIdSchema),
  requireAuth,
  requireSelfOrAdmin("id"),
  accountController.getAccountsByUserId
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     AccountDTO:
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
