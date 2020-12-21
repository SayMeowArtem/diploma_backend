import express from "express";
import { validationResult } from "express-validator";
import { SubscribeModel } from "../models/subscribeModel";
import { UserModelInterface } from "../models/UserModel";


class SubscribesController {
    async create (req: express.Request, res: express.Response) {
        try {
            const user = req.user as UserModelInterface;
            console.log(user);
            
            if (user?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }
                
                const authorID = req.body.author;
                const subscirberID = user._id;
                const checkSubcribe = await SubscribeModel.find({ $and: [ {author: authorID } , {subscriber: subscirberID}]}).exec();
                    console.log(checkSubcribe);
                if (checkSubcribe.length === 0) {
                    const data: any =  {
                        subscriber: user._id,
                        author: req.body.author,
                    }
    
                    const subscribe = await SubscribeModel.create(data);
    
                    res.json({
                        status: 'success',
                        data: await subscribe.populate('author').execPopulate()
                    })
                }
                else {
                    res.status(400).json({
                        status: 'error',
                        message: 'Данная подпиская уже существует!!!'
                    });
                }
            

            

            } 
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            });
        }
    }
}

export const SubscribeCtrl = new SubscribesController();