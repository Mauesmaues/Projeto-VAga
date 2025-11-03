import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { canView } from '../middlewares/authorizationMiddleware';

const router = Router();

// Ambos admin e operador podem visualizar o dashboard
router.get('/estatisticas', canView, DashboardController.getEstatisticas);

export default router;
