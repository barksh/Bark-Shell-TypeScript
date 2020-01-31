/**
 * @author WMXPY
 * @namespace Example
 * @description Simple
 */

import { SudooExpress, SudooExpressApplication } from "@sudoo/express";
import { Request, Response } from "express";
import * as Path from "path";
import { BarkSocket, BarkUser, RESPONSE_TYPE } from "../src";

const setting: SudooExpressApplication = SudooExpressApplication.create('Bark Shell - Example', "1.0.0");
const app: SudooExpress = SudooExpress.create(setting);

BarkSocket.extend(app.http)
    .declareUserInitiateFunction((headers) => {
        return BarkUser.create(headers.username, 'initial');
    })
    .declareUserMessageFunction((user: BarkUser, message: string) => {
        return {
            type: RESPONSE_TYPE.TEXT,
            message: `${user.username}, you said ${message}`,
        };
    })
    .declareUserGreetingFunction((user: BarkUser) => {
        return {
            type: RESPONSE_TYPE.TEXT,
            message: `Hello ${user.username}`,
        };
    })
    .initial();

app.express.get('/', (req: Request, res: Response) => {
    res.sendFile(Path.join(__dirname, '..', 'public', 'index.html'));
});

// tslint:disable-next-line: no-magic-numbers
app.host(3000);
