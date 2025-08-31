import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import transactionController from "./transaction.controller";
import {
  getTransactionByIdSchema,
  transactionSchema,
} from "./transaction.validate";
import { validate } from "../../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Transaction
 */

const router = Router();

/**
 * @swagger
 * /api/transaction/deposit:
 *   post:
 *     summary: deposit money
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionDTO'
 *     responses:
 *       201:
 *         description: Money successfully deposited
 *       400:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/deposit",
  validate(transactionSchema),
  requireAuth,
  transactionController.deposit
);

/**
 * @swagger
 * /api/transaction/withdraw:
 *   post:
 *     summary: withdraw money
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionDTO'
 *     responses:
 *       201:
 *         description: Money successfully withdrawn
 *       400:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post(
  "/withdraw",
  validate(transactionSchema),
  requireAuth,
  transactionController.withdraw
);

/**
 * @swagger
 * /api/transaction/get-transaction/{id}:
 *   get:
 *     summary: Get transaction by user id
 *     tags: [Transaction]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Transaction Id
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionDTO'
 *       404:
 *         description: Transaction not found
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

router.get(
  "/get-transaction/:id",
  validate(getTransactionByIdSchema),
  requireAuth,
  transactionController.getTransactionById
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionDTO:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           format: decimal
 *           example: 100.00
 *         accountId:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: deposit/withdraw for service
 */
