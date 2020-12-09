import { body } from 'express-validator';

export const createPlaylistValidation = [
    body('title', 'Введите название плейлиста')
     .isString()
     .isLength({
         min: 3,
         max: 100
     })
     .withMessage('Минимальная длина названия - 3 символа, максимальное - 100')
];