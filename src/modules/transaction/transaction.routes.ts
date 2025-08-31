import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import transactionController from "./transaction.controller";

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
router.post("/deposit", requireAuth, transactionController.deposit);

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
router.post("/withdraw", requireAuth, transactionController.withdraw);

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
