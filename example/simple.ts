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

BarkSocket.create()
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
            .addResponses(`I'm 0`, 'Nothing to tell you');
        const listTopic: BarkTopic = BarkTopic.create('list')
            .addExample(`Add to my list`)
            .addExample(`Things to do`)
            .useExecutable((currentUser: BarkUser) => {
                currentUser.setStatus('batch');
                return [
                    'Entered Batch Mode',
                    'Here we goes',
                ];
            });

        shell.addTopic(greetingTopic).addTopic(askAgeTopic).addTopic(listTopic);
        const bot: BarkBot = shell.generate();

        switch (user.status) {
            case 'initial': {
                const topic: BarkTopic | null = bot.answer(message);
                if (!topic) {
                    return {
                        type: RESPONSE_TYPE.TEXT,
                        message: `I can't understand you`,
                    };
                }
                const response: string = await topic.autoResponse(user, message);

                return {
                    type: RESPONSE_TYPE.TEXT,
                    message: response,
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

        return null;
    })
    .declareUserGreetingFunction((user: BarkUser) => {
        return {
            type: RESPONSE_TYPE.TEXT,
            message: `Hello ${user.username}`,
        };
    })
    .extend(app.http);

app.express.get('/', (req: Request, res: Response) => {
    res.sendFile(Path.join(__dirname, '..', 'public', 'index.html'));
});

// tslint:disable-next-line: no-magic-numbers
app.host(3000);
