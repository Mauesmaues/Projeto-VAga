import { Router } from 'express';
import { HistoricoEstoqueController } from '../controllers/HistoricoEstoqueController';
import { canView } from '../middlewares/authorizationMiddleware';

const router = Router();

router.get('/historico-estoque', canView, HistoricoEstoqueController.listarHistorico);
router.get('/historico-estoque/produto/:produto_id', canView, HistoricoEstoqueController.listarPorProduto);

export default router;
