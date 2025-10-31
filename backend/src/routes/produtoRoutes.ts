import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';

const router = Router();

router.get('/produtos', ProdutoController.listar);
router.get('/produtos/:id', ProdutoController.obterPorId);
router.post('/produtos', ProdutoController.criar);

export default router;
