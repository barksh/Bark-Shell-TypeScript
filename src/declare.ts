/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Declare
 */

export enum RESPONSE_TYPE {

    TEXT = "TEXT",
}

export type BarkShellSuggestion = {

    readonly label: string;
    readonly description?: string;
};

export type BarkShellResponse = BarkShellResponseDynamic & {

    readonly suggestions: BarkShellSuggestion[];
};

export type BarkShellResponseDynamic = {

    readonly type: RESPONSE_TYPE.TEXT;
    readonly message: string;
};
