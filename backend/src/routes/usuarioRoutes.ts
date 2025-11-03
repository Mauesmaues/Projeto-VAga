import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { validate } from '../middlewares/validateMiddleware';
import { loginSchema, usuarioSchema } from '../validators/schemas';
import { requireAdmin, canView } from '../middlewares/authorizationMiddleware';

const router = Router();

// Rotas de autenticação - públicas
router.get('/login', (req, res) => {
	res.json({ mensagem: 'Faça login via POST /login com email e senha.' });
});
router.post('/login', validate(loginSchema), UsuarioController.login);

// Rotas de usuário (CRUD) - apenas admin
router.get('/usuarios', canView, UsuarioController.listar);
router.post('/usuarios', requireAdmin, validate(usuarioSchema), UsuarioController.criar);
router.get('/usuarios/:id', canView, UsuarioController.obterPorId);
router.put('/usuarios/:id', requireAdmin, UsuarioController.atualizar);
router.delete('/usuarios/:id', requireAdmin, UsuarioController.remover);

export default router;
