import { Router } from "express";
import authController from "./auth.controller";
import { loginSchema, signUpSchema } from "./auth.validate";
import { validate } from "../../middlewares/validate";
import { requireAuth } from "../../middlewares/auth";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupDTO'
 *     responses:
 *       201:
 *         description: User creation and token generatoin
 *       409:
 *         description: User exists with this email
 *       500:
 *         description: Internal server error
 */

router.post("/signup", validate(signUpSchema), authController.signUp);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *     responses:
 *       200:
 *         description: User login and token generatoin
 *       401:
 *         description:  Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       401:
 *         description:  Invalid credentials
 *       500:
 *         description: Internal server error
 */

router.get("/me", requireAuth, authController.getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and clear cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", authController.logout);

export default router;
/**
 * @swagger
 * components:
 *   schemas:
 *     SignupDTO:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: pass1234
 *     LoginDTO:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: pass1234
 */
