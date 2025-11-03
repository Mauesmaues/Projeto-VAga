import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { validate } from '../middlewares/validateMiddleware';
import { produtoSchema } from '../validators/schemas';
import { canView, canModify } from '../middlewares/authorizationMiddleware';

const router = Router();

router.get('/produtos', canView, ProdutoController.listar);
router.get('/produtos/:id', canView, ProdutoController.obterPorId);

router.post('/produtos', canModify, validate(produtoSchema), ProdutoController.criar);
router.put('/produtos/:id', canModify, ProdutoController.atualizar);
router.delete('/produtos/:id', canModify, ProdutoController.deletar);

export default router;
