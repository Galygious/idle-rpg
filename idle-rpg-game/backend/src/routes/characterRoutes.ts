import { Router } from 'express';
import { 
  createCharacter, 
  getCharacters, 
  getCharacter, 
  updateCharacter, 
  deleteCharacter 
} from '../controllers/characterController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();

// All character routes require authentication
router.use(authenticateToken);

// Character CRUD operations
router.post('/', validateRequest(schemas.createCharacter), createCharacter as any);
router.get('/', getCharacters as any);
router.get('/:id', getCharacter as any);
router.put('/:id', validateRequest(schemas.updateCharacter), updateCharacter as any);
router.delete('/:id', deleteCharacter as any);

export default router;