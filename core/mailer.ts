import nodemailer from 'nodemailer';

const options = {
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'learnspecial192@mail.ru',
    pass: 'asdasdfq213',
  },
};

export const mailer = nodemailer.createTransport(options);
