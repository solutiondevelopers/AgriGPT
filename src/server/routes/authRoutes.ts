import { Router } from 'express';
import { signup, login, me, refreshToken } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/me', verifyToken, me);
// Logout is typically handled on the client-side by deleting the token, but we could add a route if using cookies or token blacklisting.

export default router;
