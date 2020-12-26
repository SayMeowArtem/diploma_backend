import dotenv from 'dotenv';
dotenv.config();

import './core/db';

import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './utils/register';
import { passport } from './core/passport';
import { createVideoValidation } from './utils/createVideo';
import { VideoCtrl } from './controllers/VideoContoller';
import { createPlaylistValidation } from './utils/createPlaylist';
import { PlaylistCtrl } from './controllers/PlaylistController';
import { CommentsCtrl } from './controllers/CommentsController';
import { SubscribeCtrl } from './controllers/SubscribesController';
const { cloudinary } = require('./utils/cloudinary');

var cors = require('cors');

const app = express();
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use(express.json());
app.use(passport.initialize());

app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo);
app.get('/users/all', UserCtrl.index);
app.patch('/user/me', passport.authenticate('jwt'), UserCtrl.update);


app.get('/auth/verify', registerValidations ,UserCtrl.verify);



app.post('/auth/register', registerValidations ,UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);
 
//создать запись с видео

app.patch('/video/:id', passport.authenticate('jwt'), VideoCtrl.viewsPlus);
app.get('/video/:id', passport.authenticate('jwt'), VideoCtrl.index);
app.get('/videos/:id', passport.authenticate('jwt'), VideoCtrl.index_byPlatlistID);
app.post('/videos', passport.authenticate('jwt'), createVideoValidation, VideoCtrl.create);
app.delete('/videos/:id', passport.authenticate('jwt'), VideoCtrl.delete);
app.patch('/videos/:id', passport.authenticate('jwt'), VideoCtrl.update);

//плейлисты
app.post('/playlists', passport.authenticate('jwt'), createPlaylistValidation, PlaylistCtrl.create);
app.delete('/playlists/:id', passport.authenticate('jwt'), PlaylistCtrl.delete);
app.patch('/playlists/:id', passport.authenticate('jwt'), createPlaylistValidation, PlaylistCtrl.update);

app.get('/playlists/my', passport.authenticate('jwt'), PlaylistCtrl.index_my);



//Комменты

app.delete('/comments/:id', passport.authenticate('jwt'), CommentsCtrl.delete);
app.post('/comments', passport.authenticate('jwt'), CommentsCtrl.create);
app.get('/comments/:idvideo' , passport.authenticate('jwt'), CommentsCtrl.index);

//Подписка

app.get('/subscribes', passport.authenticate('jwt'), SubscribeCtrl.index);
app.post('/subscribes', passport.authenticate('jwt'), SubscribeCtrl.create);
app.delete('/subscribes/:id', passport.authenticate('jwt'), SubscribeCtrl.delete);

//test
app.get('/profileinfo', passport.authenticate('jwt'), PlaylistCtrl.index_views);
app.get('/profile/:id', passport.authenticate('jwt'), PlaylistCtrl.index_visit);
app.get('/popular', passport.authenticate('jwt'), PlaylistCtrl.index_popular_playlists);
app.get('/mysubscribes', passport.authenticate('jwt'), PlaylistCtrl.index_subscribe)
//Файлы


app.post('/files/upload', async (req, res) => {
    try {
        const fileStr = req.body.file;

        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'prime-asset',
        });
        console.log(uploadResponse);
        res.json({ msg: 'yaya' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});



app.listen(8888, (): void => {
    console.log("SERVER RUNNED!");
});