/**
 * @author WMXPY
 * @namespace Example
 * @description Simple
 */

import { SudooExpress, SudooExpressApplication } from "@sudoo/express";
import { Request, Response } from "express";
import * as Path from "path";
import { BarkSocket, BarkUser } from "../src";

const setting: SudooExpressApplication = SudooExpressApplication.create('Bark Shell - Example', "1.0.0");
const app: SudooExpress = SudooExpress.create(setting);

const io: BarkSocket = BarkSocket.extend(app.http);
io.declareUserInitiateFunction((headers) => {
    return BarkUser.create(headers.username, 'initial');
});
io.declareUserMessageFunction((user: BarkUser, message: string) => {
    console.log(message);
    return null;
});

app.express.get('/', (req: Request, res: Response) => {
    res.sendFile(Path.join(__dirname, '..', 'public', 'index.html'));
});

// tslint:disable-next-line: no-magic-numbers
app.host(3000);
