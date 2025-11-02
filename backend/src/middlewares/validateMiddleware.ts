import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const erros = error.details.map(detail => ({
        campo: detail.path.join('.'),
        mensagem: detail.message
      }));
      
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Erro de validação',
        erros
      });
    }
    
    next();
  };
};
