import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
      return;
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must contain only alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be at most 30 characters long',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
        'any.required': 'Password is required'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  createCharacter: Joi.object({
    name: Joi.string()
      .alphanum()
      .min(2)
      .max(20)
      .required()
      .messages({
        'string.alphanum': 'Character name must contain only alphanumeric characters',
        'string.min': 'Character name must be at least 2 characters long',
        'string.max': 'Character name must be at most 20 characters long',
        'any.required': 'Character name is required'
      }),
    class: Joi.string()
      .valid('warrior', 'mage', 'rogue', 'paladin', 'necromancer')
      .required()
      .messages({
        'any.only': 'Character class must be one of: warrior, mage, rogue, paladin, necromancer',
        'any.required': 'Character class is required'
      })
  }),

  updateCharacter: Joi.object({
    name: Joi.string()
      .alphanum()
      .min(2)
      .max(20)
      .optional(),
    stats: Joi.object({
      strength: Joi.number().integer().min(0).optional(),
      dexterity: Joi.number().integer().min(0).optional(),
      intelligence: Joi.number().integer().min(0).optional(),
      vitality: Joi.number().integer().min(0).optional()
    }).optional()
  }),

  gameAction: Joi.object({
    action: Joi.string()
      .valid('startCombat', 'stopCombat', 'equipItem', 'useItem', 'levelUp')
      .required()
      .messages({
        'any.only': 'Action must be one of: startCombat, stopCombat, equipItem, useItem, levelUp',
        'any.required': 'Action is required'
      }),
    data: Joi.object().optional()
  })
};