import express from 'express';
import { UserModel, UserModelInterface } from '../models/UserModel';
import { PlaylistModel } from '../models/playlistModel';
import { VideoModel } from '../models/VideoModel';
import { SubscribeModel } from '../models/subscribeModel';
import { validationResult } from 'express-validator/src/validation-result';
import { isValidObjectId } from '../utils/isValidObjectId';


class PlaylistController {

    async index_popular_playlists(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface;
            if (user?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }

                const Playlists = await PlaylistModel.find({ }).exec();
                
                var results: number[] = await Promise.all(Playlists.map(
                    async (item): Promise<any> => {
                        const videos = await VideoModel.find({ playlist: item});
                        let sumViews: any = 0;
                        videos.forEach(el => sumViews += parseInt(el.views))
                        item.popularity = sumViews;
                        return item;
                    }
            
                ))
                    //@ts-ignore
                    results.sort((a,b) => a.popularity > b.popularity ? -1: 1);
                    results.splice(3);
                res.json({
                    status: 'success',
                    data: results,
                });

        
            }
        } catch (error) {
            
        }
    }

    async index_subscribe (req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface;
            if (user?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }
            
                const subscribe = await SubscribeModel.find({ subscriber: user._id}).populate('author').exec();
                
                res.json({
                    status: 'success',
                    data: subscribe,
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

    //Общие просмотры и подписчики пользователя(моих видео)
    async index_views (req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface;
            if (user?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }
                
                //@ts-ignore
                const videos = await VideoModel.find({ owner: user._id },).exec();
                
                const subscribers = await SubscribeModel.find({ author: user._id}).exec();

                let sum = 0;
                videos.forEach(el => 
                    sum += parseInt(el.views)  
                );

                const obj = {
                    views: sum,
                    subscribers: subscribers.length
                }

                res.json({
                    status: 'success',
                    data: obj,
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
    //Профиль другого пользователя
    async index_visit (req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface;
            if (user?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }

                const profileAuthor = req.params.id;
                
                //@ts-ignore
                const videos = await VideoModel.find({ owner: profileAuthor },).exec();
                
                const subscribers = await SubscribeModel.find({ author: profileAuthor}).exec();

                let sum = 0;
                videos.forEach(el => 
                    sum += parseInt(el.views)  
                );

                const userInfo = await UserModel.findById(profileAuthor).exec();
                //@ts-ignore
                const playlists = await PlaylistModel.find({owner: profileAuthor}).exec();

                const obj = {
                    views: sum,
                    subscribers: subscribers.length,
                    userInfo: userInfo,
                    playlists: playlists
                }

                res.json({
                    status: 'success',
                    data: obj,
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

    async index_my (req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface;
            if (user?._id) {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }
                
                //@ts-ignore
                const playlists = await PlaylistModel.find({ owner: user._id },).populate(["owner"]).exec();

                res.json({
                    status: 'success',
                    data: playlists,
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

    async create(req: any, res: express.Response): Promise<void> {
       try {
        const user = req.user as UserModelInterface;
   
        if (user?._id) {
            const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({status: 'error', errors: errors.array()});
                    return;
                }

                const data: any =  {
                    owner: user._id,
                    title: req.body.title,
                    coverURL: req.body.coverURL
                }
              
                const playlist = await PlaylistModel.create(data);

                res.json({
                    status: 'success',
                    data: await playlist.populate('owner').execPopulate(),
                })
        }
       }
       catch (error) {
        res.status(500).json({
            status: 'error',
            message: error,
            
        });
       }


    }
   
    async delete(req: express.Request, res: express.Response): Promise<void>{
        const user = req.user as UserModelInterface;
        try {
            if (user) {
                const playlistId = req.params.id;
                if (!isValidObjectId(playlistId)){

                    res.status(400).send();
                    return;
                }
                const playlist = await PlaylistModel.findById(playlistId);
                if (playlist) {
                    if ( String(playlist.owner._id) == String(user._id)) {
                        playlist.remove();
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
                const playlistId = req.params.id;

                if (!isValidObjectId(playlistId)) {
                    res.status(400).send();
                    return;
                }

                const playlist = await PlaylistModel.findById(playlistId);
              
                if (playlist) {
                    if (String(user._id) === String(playlist.owner._id)) {
                        const title = req.body.title;
                        const coverURL = req.body.coverURL;
                        if (title) {
                            playlist.title = title;
                        }
                        if (coverURL) {
                            playlist.coverURL = coverURL;
                        }
                        playlist.save();
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


export const PlaylistCtrl = new PlaylistController();