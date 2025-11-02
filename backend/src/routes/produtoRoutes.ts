import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { validate } from '../middlewares/validateMiddleware';
import { produtoSchema } from '../validators/schemas';

const router = Router();

router.get('/produtos', ProdutoController.listar);
router.get('/produtos/:id', ProdutoController.obterPorId);
router.post('/produtos', validate(produtoSchema), ProdutoController.criar);
router.put('/produtos/:id', ProdutoController.atualizar);
router.delete('/produtos/:id', ProdutoController.deletar);

export default router;
