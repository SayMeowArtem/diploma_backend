import express from 'express';
import { validationResult } from 'express-validator';

import { UserModelInterface } from '../models/UserModel';
import { VideoModel } from '../models/VideoModel';
import { CommentsModel } from '../models/commentsModel';
import { isValidObjectId } from '../utils/isValidObjectId';

class VideoController {

    async index(req: express.Request, res: express.Response): Promise<void> {
        try {
            const idVideo = req.params.id;
            const video = await VideoModel.findById(idVideo).exec();
            res.json({
                status: 'success',
                data: video,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }

    }


    async viewsPlus(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface;
            if (user?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }

            const idVideo = req.params.id;
           
            const video = await VideoModel.findById(idVideo);
            if (video) {
           
                if (String(video.owner._id) !== String(user._id)){
                    let views = video.views;
                    video.views = String( Number(views) + 1);
                    video.save();
                    res.status(200).send();
                }
                else {

                }
              
            }
           
        }
        } catch (error) {
            
        }
    }
    //COUNT COMMENTS FOR VIDEOS LIST PAGE
    async  commentsCount (idVideo : any) {
        const comments = await CommentsModel.find({ video: idVideo}).exec();
        return comments.length;
      }

    async index_byPlatlistID(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface;
            if (user?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }
            const idplaylist = req.params.id;

         const videos = await VideoModel.find({ playlist: idplaylist}).exec();
           
             
          var results: number[] = await Promise.all(videos.map(
              async (item): Promise<any> => {
                item.commentsCount =  String(await (await CommentsModel.find({ video: item._id})).length);
                return item;
              }
          ))
            
    
         

         res.json({
             status: 'success',
             data: results,
         });
    } 
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            });
        }
    }


    async create( req: any, res: express.Response): Promise<void>{
        // try {
            const owner = req.user as UserModelInterface;
            console.log("OWNER:" + owner);
            if (owner?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }
         
                const data: any =  {
                    owner: owner._id,
                    title: req.body.title,
                    url: req.body.url,
                    playlist: req.body.playlist,
                    discription: req.body.discription
                }

                const video = await VideoModel.create(data);

                res.json({
                    status: 'success',
                    data: await video.populate('user').execPopulate(),
                });

            }
        // }
        // catch (error) {
        //     res.status(500).json({
        //         status: 'error',
        //         message: error,
                
        //     });
        // }
    }

    async delete(req: express.Request, res: express.Response): Promise<void>{
        const user = req.user as UserModelInterface;
        try {
            if (user) {
                const videoId = req.params.id;
               
                if (!isValidObjectId(videoId)){

                    res.status(400).send();
                    return;
                }


                const video = await VideoModel.findById(videoId);
              
                if (video) {
                    if ( String(video.owner._id) == String(user._id)) {
                        video.remove();
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

    async update(req: express.Request, res: express.Response): Promise<void> {
        const user = req.user as UserModelInterface;

        try {
            if (user) {
                const videoId = req.params.id;
                console.log(videoId);
                if (!isValidObjectId(videoId)) {
                    res.status(400).send();
                    return;
                }

                const video = await VideoModel.findById(videoId);
                console.log(video);
                if (video) {
                    if (String(user._id) === String(video.owner._id)) {
                        const title = req.body.title;
                        if (title) {
                            video.title = title;
                        }
                    
                        video.save();
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
                message: error,
              });        
        }
    }
}

export const VideoCtrl = new VideoController();