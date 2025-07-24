import Router from 'express';
import { signUp  , login} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/login' , login);

authRouter.post('/signup', signUp);

authRouter.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});

// export default authRouter;
export { authRouter };