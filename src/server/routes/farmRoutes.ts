import { Router } from 'express';
import { getFarmProfile, updateFarmProfile } from '../controllers/farmController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getFarmProfile);
router.post('/', verifyToken, updateFarmProfile);

export default router;
