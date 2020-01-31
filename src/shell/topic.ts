/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Topic
 */

export class BarkTopic {

    public static create(topicName: string) {

        return new BarkTopic(topicName);
    }

    private readonly _topicName: string;
    private readonly _examples: string[];

    private constructor(topicName: string) {

        this._topicName = topicName;
        this._examples = [];
    }

    public get name(): string {
        return this._topicName;
    }
    public get examples(): string[] {
        return this._examples;
    }

    public addExample(example: string): this {

        this._examples.push(example);
        return this;
    }
}
