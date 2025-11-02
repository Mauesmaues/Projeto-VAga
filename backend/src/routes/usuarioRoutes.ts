import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { validate } from '../middlewares/validateMiddleware';
import { loginSchema, usuarioSchema } from '../validators/schemas';

const router = Router();

// Rotas de autenticação
router.get('/login', (req, res) => {
	res.json({ mensagem: 'Faça login via POST /login com email e senha.' });
});
router.post('/login', validate(loginSchema), UsuarioController.login);

// Rotas de usuário (CRUD)
router.get('/usuarios', UsuarioController.listar);
router.post('/usuarios', validate(usuarioSchema), UsuarioController.criar);
// router.get('/usuarios/:id', UsuarioController.obterPorId); // Implementar se necessário
// router.put('/usuarios/:id', UsuarioController.atualizar); // Implementar se necessário
// router.delete('/usuarios/:id', UsuarioController.remover); // Implementar se necessário

export default router;
