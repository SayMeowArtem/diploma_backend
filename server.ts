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



const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo);
app.get('/users/all', UserCtrl.index);
app.get('/auth/verify', registerValidations ,UserCtrl.verify);



app.post('/auth/register', registerValidations ,UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);
 
//создать запись с видео
app.post('/videos', passport.authenticate('jwt'), createVideoValidation, VideoCtrl.create);
app.delete('/videos/:id', passport.authenticate('jwt'), VideoCtrl.delete);
app.patch('/videos/:id', passport.authenticate('jwt'), createVideoValidation,VideoCtrl.update);

//плейлисты
app.post('/playlists', passport.authenticate('jwt'), createPlaylistValidation, PlaylistCtrl.create);
app.delete('/playlists/:id', passport.authenticate('jwt'), PlaylistCtrl.delete);
app.patch('/playlists/:id', passport.authenticate('jwt'), createPlaylistValidation, PlaylistCtrl.update);

app.get('/playlists/my', passport.authenticate('jwt'), PlaylistCtrl.index_my);

app.listen(8888, (): void => {
    console.log("SERVER RUNNED!");
});