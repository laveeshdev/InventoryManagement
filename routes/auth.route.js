import Router from 'express';
import { signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/login' , (req, res) => {
    // Handle user login
    res.send("User logged in");
});

authRouter.post('/signup', signUp);

authRouter.post('/logout', (req, res) => {
    // Handle user logout
    res.send("User logged out");
});

// export default authRouter;
export { authRouter };