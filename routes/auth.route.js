import Router from 'express';
import { signUp  , login} from '../controllers/auth.controller.js';

const authRouter = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
authRouter.post('/login' , login);

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Signup user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup successful
 *       409:
 *         description: User already exists
 */
authRouter.post('/signup', signUp);


authRouter.post('/logout', (req, res) => {
    res.clearCookie('token').json({ success: true, message: 'Logged out successfully' });
});

authRouter.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});

// export default authRouter;
export { authRouter };