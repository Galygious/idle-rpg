import { Router } from 'express';
import { getGameState, performGameAction } from '../controllers/gameController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();

// All game routes require authentication
router.use(authenticateToken);

// Game state and actions
router.get('/:characterId/state', getGameState as any);
router.post('/:characterId/action', validateRequest(schemas.gameAction), performGameAction as any);

export default router;