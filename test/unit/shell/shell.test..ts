/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Shell
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { BarkShell } from '../../../src';

describe('Given {BarkShell} Class', (): void => {

    const chance: Chance.Chance = new Chance('bark-shell-class');

    it('should be able to construct', (): void => {

        const shell: BarkShell = BarkShell.create();

        expect(shell).to.be.instanceOf(BarkShell);
    });
});
