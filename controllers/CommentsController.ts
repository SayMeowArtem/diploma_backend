
import express from 'express';
import { validationResult } from 'express-validator';
import { CommentsModel } from '../models/commentsModel';
import { UserModelInterface } from '../models/UserModel';
import { isValidObjectId } from '../utils/isValidObjectId';

class CommentsController {


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
                
                const data: any =  {
                    owner: user._id,
                    text: req.body.text,
                    video: req.body.video
                }

                const comment = await CommentsModel.create(data);

                res.json({
                    status: 'success',
                    data: await comment.populate('owner').execPopulate(),
                })

            } 
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            });
        }
    }

    async index(req: express.Request, res: express.Response): Promise<void> {
        try {
            const idVideo = req.params.idvideo;
            //@ts-ignore
            const comments = await CommentsModel.find( { video: idVideo}).populate('owner').exec();
            res.json({
                status: 'success',
                data: comments,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }

    }

    async delete (req: express.Request, res: express.Response): Promise<void> {

        try {
 
            const user = req.user as UserModelInterface;
            console.log("USER" + user)
            if (user) {
                const commentId = req.params.id;
                if (!isValidObjectId(commentId)){

                    res.status(400).send();
                    return;
                }
                const comment = await CommentsModel.findById(commentId);
                if (comment) {
                    if ( String(comment.owner._id) == String(user._id)) {
                        comment.remove();
                        res.send();
                    }
                    else {
                        res.status(403).send();
                    }
                }
                else {
                    res.status(404).send();
                }
            }
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
}
}

export const CommentsCtrl = new CommentsController();