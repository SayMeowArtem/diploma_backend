import express from 'express';
import { UserModelInterface } from '../models/UserModel';
import { PlaylistModel } from '../models/playlistModel';
import { validationResult } from 'express-validator/src/validation-result';
import { isValidObjectId } from '../utils/isValidObjectId';

class PlaylistController {

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