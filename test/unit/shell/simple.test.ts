/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Simple
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { BarkShell, BarkTopic } from '../../../src';
import { BarkBot } from '../../../src/bot';

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

    it('should be able to answer question - greeting', (): void => {

        const answer: string = bot.classify('hi');

        expect(answer).to.be.equal(firstName);
    });

    it('should be able to answer question - age', (): void => {

        const answer: string = bot.classify('How old are you?');

        expect(answer).to.be.equal(secondName);
    });
});
