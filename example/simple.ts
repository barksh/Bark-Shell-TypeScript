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

        const greetingTopic: BarkTopic = BarkTopic.create('greeting')
            .addExample('Hello')
            .addExample(`How's your day?`)
            .addResponses(`I'm fine thank you, and you?`);
        const askAgeTopic: BarkTopic = BarkTopic.create('ask-age')
            .addExample(`What's your age`)
            .addExample(`How old are you`)
            .addResponse(`I'm 0`);
        const listTopic: BarkTopic = BarkTopic.create('ask-age')
            .addExample(`Add to my list`)
            .addExample(`Things to do`)
            .useExecutable((user: BarkUser, message: string) => {
                return '';
            });

        shell.addTopic(greetingTopic).addTopic(askAgeTopic);
        const bot: BarkBot = shell.generate();

        switch (user.status) {
            case 'initial': {
                const topic: BarkTopic = bot.answer(message);
                const response: string = await topic.autoResponse(user, message);

                return {
                    type: RESPONSE_TYPE.TEXT,
                    message: `${user.username}, you said ${message}`,
                };
            }
            case 'batch': {

                executer({
                    type: RESPONSE_TYPE.TEXT,
                    message: `Adding ${message} to your list`,
                });
                await new Promise((resolve) => setTimeout(resolve, TIME_IN_MILLISECONDS.SECOND));
                return {
                    type: RESPONSE_TYPE.TEXT,
                    message: `${message}, added`,
                };
            }
        }
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
