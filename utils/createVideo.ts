import { body } from 'express-validator';

export const createVideoValidation = [
    body('title', 'Введите название видео')
     .isString()
     .isLength({
         min: 3,
         max: 100
     })
     .withMessage('Минимальная длина названия - 3 символа, максимальное - 100')
];