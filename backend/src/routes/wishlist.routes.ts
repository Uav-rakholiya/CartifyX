import { Router } from 'express';
import { getWishlist, toggleWishlist, syncWishlist } from '../controllers/wishlist.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getWishlist);
router.post('/toggle', authMiddleware, toggleWishlist);
router.post('/sync', authMiddleware, syncWishlist);

export default router;
