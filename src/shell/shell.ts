/**
 * @author WMXPY
 * @namespace Bark_Shell_Shell
 * @description Shell
 */

import { BayesClassifier } from "natural";
import { BarkBot } from "./bot";
import { BarkTopic } from "./topic";

export class BarkShell {

    public static create(): BarkShell {

        return new BarkShell();
    }

    private readonly _topics: BarkTopic[];

    private constructor() {

        this._topics = [];
    }

    public addTopic(topic: BarkTopic): this {

        this._topics.push(topic);
        return this;
    }

    public generate(): BarkBot {

        const classifier: BayesClassifier = new BayesClassifier();
        for (const topic of this._topics) {
            for (const example of topic.examples) {
                classifier.addDocument(example, topic.name);
            }
        }

        classifier.train();
        return BarkBot.create(classifier, this._topics);
    }
}
