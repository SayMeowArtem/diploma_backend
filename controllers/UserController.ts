import express from 'express';
import { UserModel, UserModelDocumentInterface, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';
import { validationResult } from 'express-validator';
import { SendEmail } from '../utils/sendMail';

import jwt from 'jsonwebtoken';
import { SubscribeModel } from '../models/subscribeModel';
import { PlaylistModel } from '../models/playlistModel';




class UserController {
   async index(_: any, res: express.Response): Promise<void> {
       try {
       
         const users = await UserModel.find({}).populate("author").exec();
         res.json({
             status: 'success',
             data: users,
         });
       }
       catch (error) {
           res.status(500).json({
               status: 'error',
               message: error,
           });
       }
   }

   async index_counts(req: express.Request, res: express.Response): Promise<void> {
    // try {
        const user = req.user as UserModelInterface;
        if (user?._id) {
            const errors = validationResult(req);
            
            if (!errors.isEmpty()) {
                res.status(400).json({status: 'error', errors: errors.array()});
                return;
            }
            let UserSelected;
            const id = req.params.id
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                UserSelected = await UserModel.findById(id).exec();
              }

              

        console.log(UserSelected);
     
            if (UserSelected) {
                let subscribesCount = (await SubscribeModel.find({author: UserSelected._id}).exec()).length;
                let coursesCount = (await PlaylistModel.find({owner: UserSelected._id}).exec()).length;
              let obj = {
                subscribesCount,
                coursesCount
              }
                res.status(200).json({
                    status: 'success',
                    data: obj
                });
            }
       
       
    }
    // } catch (error) {
        
    // }
}
   

   async update(req: express.Request, res: express.Response): Promise<void> {
   
    // try {
   
        const user = req.user as UserModelInterface;
        const userID = user._id;
        if (user) {
           
            const user= await UserModel.findById(userID);
          
            if (user) {
                    const fullname = req.body.fullname;
                    const avatar = req.body.avatar;
                    const discription = req.body.discription
                    if (fullname) {
                        user.fullname = fullname;
                    }
                    if (avatar) {
                        user.avatar = avatar;
                    }
                    if (discription) {
                        user.discription = discription;
                    }
                    user.save();
                    res.send();
                
             
            // }
            // else {
            //     res.status(404).send();
            // }
        }
    }
    // catch (error) {
    //     res.status(500).json({
    //         status: 'error',
    //         message: error,
    //       });        
    // }
}

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
           const errors = validationResult(req);
           if (!errors.isEmpty()) {
               res.status(400).json({ status: 'error', errors: errors.array()});
               return;
           } 
           const data: UserModelInterface = {
               email: req.body.email,
               username: req.body.username,
               fullname: req.body.fullname,
               password: generateMD5(req.body.password + process.env.SECRET_KEY),
               confirmHash: generateMD5(process.env.SECRET_KEY + Math.random().toString()),
           }
           
           const user =  await UserModel.create(data);
            
           SendEmail(
               {
                   emailFrom: 'learnspecial192@mail.ru',
                   emailTo: data.email,
                   subject: 'Подтверждение почты на LearnSpecial',
                   html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:${3000}/auth/verify?hash=${data.confirmHash}"> по данной ссылке </a>`,
               },
               (err: Error | null) => {
                    if (err) {
                        res.status(500).json({
                            status:'error',
                            message: err,
                      });
                    } else {
                        res.status(201).json({
                            status: 'success',
                            data: user
                        });
                    }
               }
           );
        }
         catch (error) {
             res.status(500).json({
                 status: 'error',
                 message: error
             })
         }
    }


    async verify(req: any, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash;

            if (!hash) {
                res.status(400).send();
                return;
            }

            const user = await UserModel.findOne({confirmHash: hash}).exec();
         
            if (user) {
                user.confirmed = true;
                await user.save();

                res.json({
                    status: 'success',
                    message: 'аккаунт подтвержден'
                });
            }
            else {
                res.status(404).json({ status: 'error', message: 'Пользователь не найден'});
            }

        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            })
        }
    }

    async afterLogin( req: any, res: express.Response): Promise<void> {
        try{
            const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined;
            res.json({
                status: 'success',
                data: {
                    ...user,
                    token: jwt.sign({data: req.user}, process.env.SECRET_KEY || '123', {
                        expiresIn: '30 days',
                    }),
                },
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            });
        }
    }

    async getUserInfo(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined;
            console.log(user);
            res.json({
                status: 'success',
                data: user,
            })
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            })
        }
    }


}

export const UserCtrl = new UserController();