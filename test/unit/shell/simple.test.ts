/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Simple
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { BarkBot, BarkShell, BarkTopic } from '../../../src';

describe('Given {BarkShell} Class - Simple Simulate', (): void => {

    const chance: Chance.Chance = new Chance('bark-shell-class-simple');

    const firstName: string = chance.string();
    const secondName: string = chance.string();

    let bot: BarkBot = undefined as any;

    beforeEach(() => {
        const shell: BarkShell = BarkShell.create();
        const firstTopic: BarkTopic = BarkTopic.create(firstName);
        const secondTopic: BarkTopic = BarkTopic.create(secondName);

        firstTopic.addExample('Hello').addExample(`How's your day?`);
        secondTopic.addExample(`What's your age`).addExample(`How old are you`);

        shell.addTopic(firstTopic).addTopic(secondTopic);
        bot = shell.generate();
    });

    afterEach(() => {
        bot = undefined as any;
    });

    it('should be able to classify', (): void => {

        const result: Record<string, number> = bot.classify('hello');

        expect(Object.keys(result)).to.be.lengthOf(2);
    });

    it('should be able to answer question - greeting', (): void => {

        const answer: BarkTopic | null = bot.answer('hi');

        // tslint:disable-next-line: no-unused-expression
        expect(answer).to.be.exist;
        expect(answer?.name).to.be.equal(firstName);
    });

    it('should be able to answer question - age', (): void => {

        const answer: BarkTopic | null = bot.answer('How old are you?');

        // tslint:disable-next-line: no-unused-expression
        expect(answer).to.be.exist;
        expect(answer?.name).to.be.equal(secondName);
    });
});
