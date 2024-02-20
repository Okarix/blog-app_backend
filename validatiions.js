import { body } from 'express-validator';

export const registerValidation = [body('email', 'Invalid mail format').isEmail(), body('password', 'Password must be minimum 8 symbols').isLength({ min: 8 }), body('fullName', 'Enter your name').isLength({ min: 2 }), body('avatarUrl', 'Incorrect link to avatar').optional().isString()];

export const loginValidation = [body('email', 'Invalid mail format').isEmail(), body('password', 'Password must be minimum 8 symbols').isLength({ min: 8 })];

export const postCreateValidation = [body('title', 'Enter article title').isLength({ min: 3 }).isString(), body('text', 'Enter article text').isLength({ min: 5 }).isString(), body('tags', 'Invalid tag format').optional().isString(), body('imageUrl', 'Invalid image link').optional().isString()];
