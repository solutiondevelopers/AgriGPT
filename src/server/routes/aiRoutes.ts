import { Router } from 'express';
import { chat } from '../controllers/aiController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Make token verification optional for chat so guest preview still works,
// but authenticated users get history and farm context.
// Custom middleware to optionally decode token
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'agrigpt-super-secret-key-development-only';

const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // ignore invalid token for optional auth
    }
  }
  next();
};

router.post('/chat', optionalAuth, chat);

export default router;
