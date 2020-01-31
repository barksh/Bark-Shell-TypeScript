/**
 * @author WMXPY
 * @namespace Example
 * @description Simple
 */

import { SudooExpress, SudooExpressApplication } from "@sudoo/express";
import { Request, Response } from "express";
import * as Path from "path";
import * as SocketIO from "socket.io";

const setting: SudooExpressApplication = SudooExpressApplication.create('Bark Shell - Example', "1.0.0");
const app: SudooExpress = SudooExpress.create(setting);

const io: SocketIO.Server = SocketIO(app.http);

app.express.get('/', (req: Request, res: Response) => {
    res.sendFile(Path.join(__dirname, '..', 'public', 'index.html'));
});

io.on('connection', (socket: SocketIO.Socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg: string) => {
        console.log(msg);
    });
});

// tslint:disable-next-line: no-magic-numbers
app.host(3000);
