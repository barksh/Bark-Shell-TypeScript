/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Declare
 */

export enum ATTACHMENT_TYPE {

    TEXT = "TEXT",
}

export type BarkShellSuggestion = {

    readonly label: string;
    readonly value: string;
    readonly description?: string;
};

export type BarkShellAttachment = {

    readonly type: ATTACHMENT_TYPE.TEXT;
    readonly message: string;
};

export type BarkShellResponse = {

    readonly message: string;
    readonly attachments?: BarkShellAttachment[];
    readonly suggestions?: BarkShellSuggestion[];
};
