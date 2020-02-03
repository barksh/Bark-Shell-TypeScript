/**
 * @author WMXPY
 * @namespace Bark_Shell_Shell
 * @description Topic
 */

import { randomIntegerBelow } from "@sudoo/random";
import { BarkShellResponse } from "../declare";
import { BarkSession } from "../session/session";
import { TopicExecutable, TopicResponse } from "./declare";

export class BarkTopic {

    public static create(topicName: string) {

        return new BarkTopic(topicName);
    }

    private readonly _topicName: string;
    private readonly _examples: string[];
    private readonly _responses: BarkShellResponse[];

    private _executable: TopicExecutable | null;

    private constructor(topicName: string) {

        this._topicName = topicName;
        this._examples = [];
        this._responses = [];

        this._executable = null;
    }

    public get name(): string {
        return this._topicName;
    }
    public get examples(): string[] {
        return this._examples;
    }
    public get responses(): BarkShellResponse[] {
        return this._responses;
    }

    public async autoResponse(session: BarkSession, message: string): Promise<BarkShellResponse> {

        if (this._executable) {
            return await this.execute(session, message);
        }

        return this.pickResponse();
    }

    public async execute(session: BarkSession, message: string): Promise<BarkShellResponse> {

        if (!this._executable) {
            throw new Error('[BARK-SHELL] Executable Required');
        }

        const result: TopicResponse = await Promise.resolve(this._executable(session, message));

        if (Array.isArray(result)) {

            if (result.length === 0) {
                throw new Error('[BARK-SHELL] At least one response required - Executable');
            }
            const index: number = randomIntegerBelow(result.length);
            return this._convertString(result[index]);
        }
        return this._convertString(result);
    }

    public useExecutable(executable: TopicExecutable): this {

        this._executable = executable;
        return this;
    }

    public pickResponse(): BarkShellResponse {

        if (this._responses.length === 0) {
            throw new Error('[BARK-SHELL] At least one response required');
        }
        const index: number = randomIntegerBelow(this._responses.length);
        return this._responses[index];
    }

    public addExample(example: string): this {

        this._examples.push(example);
        return this;
    }

    public addExampleList(examples: string[]): this {

        this._examples.push(...examples);
        return this;
    }

    public addExamples(...examples: string[]): this {

        return this.addExampleList(examples);
    }

    public addResponse(response: BarkShellResponse | string): this {

        this._responses.push(this._convertString(response));
        return this;
    }

    public addResponseList(responses: Array<BarkShellResponse | string>): this {

        for (const response of responses) {
            this.addResponse(response);
        }
        return this;
    }

    public addResponses(...responses: Array<BarkShellResponse | string>): this {

        return this.addResponseList(responses);
    }

    private _convertString(target: string | BarkShellResponse): BarkShellResponse {

        if (typeof target === 'string') {
            return {
                message: target,
            };
        }

        return target;
    }
}
