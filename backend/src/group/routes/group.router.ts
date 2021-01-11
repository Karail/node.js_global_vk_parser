import { Router } from 'express';
// Controllers
import { groupController } from '../controllers';

const router = Router();

router.get('/', groupController.search)

export default router;