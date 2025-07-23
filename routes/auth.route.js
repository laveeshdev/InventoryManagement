import Router from 'express';
import { signUp  , login} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/login' , login);

authRouter.post('/signup', signUp);

authRouter.post('/logout', (req, res) => {
    // Handle user logout
    res.send("User logged out");
});

// export default authRouter;
export { authRouter };