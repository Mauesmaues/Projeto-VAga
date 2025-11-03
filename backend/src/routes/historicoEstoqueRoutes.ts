import { Router } from 'express';
import { HistoricoEstoqueController } from '../controllers/HistoricoEstoqueController';
import { canView } from '../middlewares/authorizationMiddleware';

const router = Router();

// Ambos admin e operador podem visualizar o histórico
router.get('/historico-estoque', canView, HistoricoEstoqueController.listarHistorico);
router.get('/historico-estoque/produto/:produto_id', canView, HistoricoEstoqueController.listarPorProduto);

export default router;
