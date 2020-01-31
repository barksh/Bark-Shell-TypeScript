/**
 * @author WMXPY
 * @namespace Bark_Shell_Shell
 * @description Topic
 */

import { randomIntegerBelow } from "@sudoo/random";
import { BarkUser } from "../status/user";
import { TopicExecutable } from "./declare";

export class BarkTopic {

    public static create(topicName: string) {

        return new BarkTopic(topicName);
    }

    private readonly _topicName: string;
    private readonly _examples: string[];
    private readonly _responses: string[];

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
    public get responses(): string[] {
        return this._responses;
    }

    public execute(user: BarkUser, message: string): string {

        if (!this._executable) {
            throw new Error('[BARK-SHELL] Executable Required');
        }

        const result: string = this._executable(user, message);
        return result;
    }

    public pickResponse(): string {

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

    public addResponse(response: string): this {

        this._responses.push(response);
        return this;
    }

    public addResponseList(responses: string[]): this {

        this._responses.push(...responses);
        return this;
    }

    public addResponses(...responses: string[]): this {

        return this.addExampleList(responses);
    }
}
