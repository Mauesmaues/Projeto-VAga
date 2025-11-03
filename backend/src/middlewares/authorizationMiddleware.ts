import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/api';

/**
 * Middleware que verifica se o usuário é admin
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ 
      error: 'Acesso negado. Apenas administradores podem realizar esta ação.' 
    });
  }

  next();
};

/**
 * Middleware que permite acesso para admin e operador (ambos autenticados)
 */
export const requireAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  next();
};

/**
 * Middleware que verifica se o usuário pode modificar recursos
 * Apenas admin pode criar/editar/deletar
 */
export const canModify = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ 
      error: 'Acesso negado. Você não tem permissão para modificar este recurso.' 
    });
  }

  next();
};

/**
 * Middleware que permite apenas leitura
 * Ambos admin e operador podem visualizar
 */
export const canView = requireAuthenticated;
