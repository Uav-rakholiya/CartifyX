import { Router } from 'express';
import { getAllUsers, deleteUser, updateUserRole, addAddress, deleteAddress } from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';
import adminMiddleware from '../middleware/admin.middleware';

const router = Router();

// User Address Management Routes
router.post('/address', authMiddleware, addAddress);
router.delete('/address/:addressId', authMiddleware, deleteAddress);

// Admin Routes for User Management
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);
router.patch('/:id/role', authMiddleware, adminMiddleware, updateUserRole);

export default router;
