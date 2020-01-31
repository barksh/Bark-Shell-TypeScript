/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Bot
 */

import { BayesClassifier } from "natural";

export class BarkBot {

    public static create(classifier: BayesClassifier) {

        return new BarkBot(classifier);
    }

    private readonly _classifier: BayesClassifier;

    private constructor(classifier: BayesClassifier) {

        this._classifier = classifier;
    }

    public classify(input: string): string {

        const result: string = this._classifier.classify(input);
        return result;
    }
}
