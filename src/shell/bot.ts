/**
 * @author WMXPY
 * @namespace Bark_Shell_Shell
 * @description Bot
 */

import { BayesClassifier, BayesClassifierClassification } from "natural";
import { BarkTopic } from "./topic";

export class BarkBot {

    public static create(classifier: BayesClassifier, topics: BarkTopic[]) {

        const topicMap: Map<string, BarkTopic> = new Map();
        for (const topic of topics) {
            topicMap.set(topic.name, topic);
        }

        return new BarkBot(classifier, topicMap);
    }

    private readonly _classifier: BayesClassifier;
    private readonly _topicMap: Map<string, BarkTopic>;

    private constructor(classifier: BayesClassifier, topicMap: Map<string, BarkTopic>) {

        this._classifier = classifier;
        this._topicMap = topicMap;
    }

    public answer(question: string): BarkTopic | null {

        const result: string = this._classifier.classify(question);
        const topic: BarkTopic | undefined = this._topicMap.get(result);

        if (!topic) {
            return null;
        }

        return topic;
    }

    public classify(input: string): Record<string, number> {

        const result: BayesClassifierClassification[] = this._classifier.getClassifications(input);
        return result.reduce((previous: Record<string, number>, current: BayesClassifierClassification) => {
            return {
                ...previous,
                [current.label]: current.value,
            };
        }, {} as Record<string, number>);
    }
}
