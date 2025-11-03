import { Router } from 'express';
import { VendaController } from '../controllers/VendaController';
import { validate } from '../middlewares/validateMiddleware';
import { vendaSchema } from '../validators/schemas';
import { requireAuthenticated } from '../middlewares/authorizationMiddleware';

const router = Router();

router.get('/', requireAuthenticated, VendaController.listar);
router.post('/', requireAuthenticated, validate(vendaSchema), VendaController.criar);
router.get('/:id', requireAuthenticated, VendaController.buscarPorId);

export default router;
