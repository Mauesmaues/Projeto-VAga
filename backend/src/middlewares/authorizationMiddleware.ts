import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/api';

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

export const canView = requireAuthenticated;
