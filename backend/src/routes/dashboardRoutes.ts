import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';

const router = Router();

// Buscar estatísticas do dashboard
router.get('/estatisticas', DashboardController.getEstatisticas);

export default router;
