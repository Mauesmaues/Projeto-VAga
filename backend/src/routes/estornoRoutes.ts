import { Router } from 'express';
import { EstornoController } from '../controllers/EstornoController';
import { requireAuthenticated, requireAdmin } from '../middlewares/authorizationMiddleware';

const router = Router();
const estornoController = new EstornoController();

// Criar estorno (apenas admin)
router.post('/', requireAuthenticated, requireAdmin, estornoController.criarEstorno);

// Verificar se venda foi estornada
router.get('/verificar/:vendaId', requireAuthenticated, estornoController.verificarEstorno);

// Buscar estorno por venda
router.get('/venda/:vendaId', requireAuthenticated, estornoController.buscarPorVenda);

// Listar todos os estornos
router.get('/', requireAuthenticated, estornoController.listarEstornos);

export default router;
