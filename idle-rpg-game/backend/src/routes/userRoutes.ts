import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateRequest(schemas.register), registerUser);
router.post('/login', validateRequest(schemas.login), loginUser);

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, validateRequest(schemas.updateCharacter), updateUserProfile);

export default router;