import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório'
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória'
  })
});

export const usuarioSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório'
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória'
  }),
  tipo: Joi.string().valid('admin', 'operador').required().messages({
    'any.only': 'Tipo deve ser "admin" ou "operador"',
    'any.required': 'Tipo é obrigatório'
  })
});

export const produtoSchema = Joi.object({
  nome: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome deve ter no máximo 200 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  preco: Joi.number().positive().required().messages({
    'number.positive': 'Preço deve ser maior que zero',
    'any.required': 'Preço é obrigatório'
  }),
  quantidade: Joi.number().integer().min(0).required().messages({
    'number.min': 'Quantidade não pode ser negativa',
    'number.integer': 'Quantidade deve ser um número inteiro',
    'any.required': 'Quantidade é obrigatória'
  })
});

export const vendaSchema = Joi.object({
  usuario_id: Joi.string().uuid().optional().messages({
    'string.guid': 'ID do usuário deve ser um UUID válido'
  }),
  valor_total: Joi.number().positive().required().messages({
    'number.positive': 'Valor total deve ser maior que zero',
    'any.required': 'Valor total é obrigatório'
  }),
  forma_pagamento: Joi.string().valid('dinheiro', 'cartao', 'pix').required().messages({
    'any.only': 'Forma de pagamento deve ser "dinheiro", "cartao" ou "pix"',
    'any.required': 'Forma de pagamento é obrigatória'
  }),
  itens: Joi.array().items(
    Joi.object({
      produto_id: Joi.string().uuid().required().messages({
        'string.guid': 'ID do produto deve ser um UUID válido',
        'any.required': 'ID do produto é obrigatório'
      }),
      produto_nome: Joi.string().optional(),
      quantidade: Joi.number().integer().positive().required().messages({
        'number.positive': 'Quantidade deve ser maior que zero',
        'number.integer': 'Quantidade deve ser um número inteiro',
        'any.required': 'Quantidade é obrigatória'
      }),
      preco_unitario: Joi.number().positive().required().messages({
        'number.positive': 'Preço unitário deve ser maior que zero',
        'any.required': 'Preço unitário é obrigatório'
      }),
      subtotal: Joi.number().positive().required().messages({
        'number.positive': 'Subtotal deve ser maior que zero',
        'any.required': 'Subtotal é obrigatório'
      })
    })
  ).min(1).required().messages({
    'array.min': 'É necessário pelo menos 1 item',
    'any.required': 'Itens são obrigatórios'
  })
});
