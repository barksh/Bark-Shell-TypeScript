/**
 * @author WMXPY
 * @namespace Example
 * @description Simple
 */

import { SudooExpress, SudooExpressApplication } from "@sudoo/express";
import * as SocketIO from "socket.io";

const setting: SudooExpressApplication = SudooExpressApplication.create('Bark Shell - Example', "1.0.0");
const app: SudooExpress = SudooExpress.create(setting);

const io: SocketIO.Server = SocketIO(app.http);

io.on('connection', (socket: SocketIO.Socket) => {
    console.log('a user connected');
});

// tslint:disable-next-line: no-magic-numbers
app.host(3000);
