/**
 * @author WMXPY
 * @namespace Bark_Shell_Shell
 * @description Declare
 */

import { BarkShellResponse } from "../declare";
import { BarkSession } from "../session/session";

export type TopicResponse =
    string
    | BarkShellResponse
    | Array<BarkShellResponse | string>;

export type TopicExecutable = (session: BarkSession, message: string) => (
    TopicResponse
    | Promise<TopicResponse>
);
