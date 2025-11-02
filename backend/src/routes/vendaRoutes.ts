import { Router } from 'express';
import { VendaController } from '../controllers/VendaController';
import { validate } from '../middlewares/validateMiddleware';
import { vendaSchema } from '../validators/schemas';

const router = Router();

// Listar todas as vendas
router.get('/', VendaController.listar);

// Criar nova venda (com validação)
router.post('/', validate(vendaSchema), VendaController.criar);

// Buscar venda por ID
router.get('/:id', VendaController.buscarPorId);

export default router;
