import { Router } from 'express';
import { HistoricoEstoqueController } from '../controllers/HistoricoEstoqueController';

const router = Router();

router.get('/historico-estoque', HistoricoEstoqueController.listarHistorico);
router.get('/historico-estoque/produto/:produto_id', HistoricoEstoqueController.listarPorProduto);

export default router;
