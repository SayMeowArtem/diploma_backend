import express from 'express';

const app = express();

app.get('/helo', (_, res: express.Response) => {
    res.send('Hii!');
});

app.listen(8888, (): void => {
    console.log("SERVER RUNNED!");
});