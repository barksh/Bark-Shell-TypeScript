/**
 * @author WMXPY
 * @namespace Example
 * @description Simple
 */

import { SudooExpress, SudooExpressApplication } from "@sudoo/express";
import { TIME_IN_MILLISECONDS } from "@sudoo/magic";
import { Request, Response } from "express";
import * as Path from "path";
import { BarkBot, BarkSession, BarkShell, BarkShellResponse, BarkSocket, BarkTopic, MiddleResponseExecuter } from "../src";

const setting: SudooExpressApplication = SudooExpressApplication.create('Bark Shell - Example', "1.0.0");
const app: SudooExpress = SudooExpress.create(setting);

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
    .useExecutable((currentSession: BarkSession) => {
        currentSession.pushStatus('batch');
        return [
            'Entered Batch Mode',
            'Here we goes',
        ];
    });

shell.addTopic(greetingTopic).addTopic(askAgeTopic).addTopic(listTopic);
const bot: BarkBot = shell.generate();

BarkSocket.create()
    .declareSessionInitiateFunction((headers) => {
        console.log('hello');
        return null;
    })
    .declareStatusHandler('initial', async (session: BarkSession, message: string) => {
        const topic: BarkTopic | null = bot.answer(message);
        if (!topic) {
            return {
                message: `I can't understand you`,
            };
        }
        const response: BarkShellResponse = await topic.autoResponse(session, message);
        return response;
    })
    .declareStatusHandler('batch', async (_: BarkSession, message: string, executer: MiddleResponseExecuter) => {
        executer({ message: `Adding ${message} to your list` });
        await new Promise((resolve) => setTimeout(resolve, TIME_IN_MILLISECONDS.SECOND));
        return {
            message: `${message}, added`,
        };
    })
    .declareSessionGreetingFunction((session: BarkSession) => {
        return {
            message: `Hello ${session.authorization}`,
        };
    })
    .extend(app.http, '/hello');

BarkSocket.create()
    .declareSessionInitiateFunction((headers) => {
        console.log('world');
        return BarkSession.create(headers.username, 'initial');
    })
    .declareStatusHandler('initial', async (session: BarkSession, message: string) => {
        const topic: BarkTopic | null = bot.answer(message);
        if (!topic) {
            return {
                message: `I can't understand you`,
            };
        }
        const response: BarkShellResponse = await topic.autoResponse(session, message);
        return response;
    })
    .declareStatusHandler('batch', async (_: BarkSession, message: string, executer: MiddleResponseExecuter) => {
        executer({ message: `Adding ${message} to your list` });
        await new Promise((resolve) => setTimeout(resolve, TIME_IN_MILLISECONDS.SECOND));
        return {
            message: `${message}, added`,
        };
    })
    .declareSessionGreetingFunction((session: BarkSession) => {
        return {
            message: `Hello ${session.authorization}`,
        };
    })
    .extend(app.http, '/world');

app.express.get('/', (req: Request, res: Response) => {
    res.sendFile(Path.join(__dirname, '..', 'public', 'index.html'));
});

// tslint:disable-next-line: no-magic-numbers
app.host(3000);
