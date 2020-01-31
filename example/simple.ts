/**
 * @author WMXPY
 * @namespace Example
 * @description Simple
 */

import { SudooExpress, SudooExpressApplication } from "@sudoo/express";
import { TIME_IN_MILLISECONDS } from "@sudoo/magic";
import { Request, Response } from "express";
import * as Path from "path";
import { BarkBot, BarkShell, BarkSocket, BarkTopic, BarkUser, MiddleResponseExecuter, RESPONSE_TYPE } from "../src";

const setting: SudooExpressApplication = SudooExpressApplication.create('Bark Shell - Example', "1.0.0");
const app: SudooExpress = SudooExpress.create(setting);

BarkSocket.extend(app.http)
    .declareUserInitiateFunction((headers) => {
        return BarkUser.create(headers.username, 'initial');
    })
    .declareUserMessageFunction(async (user: BarkUser, message: string, executer: MiddleResponseExecuter) => {

        const shell: BarkShell = BarkShell.create();
        const firstTopic: BarkTopic = BarkTopic.create('greeting');
        const secondTopic: BarkTopic = BarkTopic.create('ask-age');

        firstTopic.addExample('Hello').addExample(`How's your day?`);
        secondTopic.addExample(`What's your age`).addExample(`How old are you`);

        shell.addTopic(firstTopic).addTopic(secondTopic);
        const bot: BarkBot = shell.generate();

        executer({
            type: RESPONSE_TYPE.TEXT,
            message: `Loading`,
        });
        await new Promise((resolve) => setTimeout(resolve, TIME_IN_MILLISECONDS.SECOND));
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
