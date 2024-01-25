import { body } from 'express-validator';

export const registerValidation = [body('email', 'Invalid mail format').isEmail(), body('password', 'Password must be minimum 8 symbols').isLength({ min: 8 }), body('fullName', 'Enter your name').isLength({ min: 2 }), body('avatarUrl', 'Incorrect link to avatar').optional().isURL()];
